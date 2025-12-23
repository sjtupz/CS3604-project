import argparse
import datetime as dt
import json
import random
import sqlite3
from collections import defaultdict
from pathlib import Path


SEAT_KEYS = ['商务座', '一等座', '二等座', '软卧', '硬卧', '硬座', '无座', '其他']
TRAIN_PREFIXES = ['G', 'D', 'Z', 'K', 'T']


def date_range(start: dt.date, days: int) -> list[str]:
    return [(start + dt.timedelta(days=i)).isoformat() for i in range(days)]


def ensure_columns(conn: sqlite3.Connection) -> None:
    cur = conn.execute('PRAGMA table_info(train_tickets)')
    cols = {row[1] for row in cur.fetchall()}
    if 'seat_availability' not in cols:
        conn.execute('ALTER TABLE train_tickets ADD COLUMN seat_availability TEXT')
    if 'seed_tag' not in cols:
        conn.execute('ALTER TABLE train_tickets ADD COLUMN seed_tag TEXT')


def ensure_indexes(conn: sqlite3.Connection) -> None:
    conn.execute(
        'CREATE INDEX IF NOT EXISTS idx_train_tickets_query ON train_tickets(date, start_station, end_station)'
    )
    try:
        conn.execute(
            'CREATE INDEX IF NOT EXISTS idx_rf_inventories_train_date ON rf_inventories(train_id, travel_date)'
        )
    except sqlite3.OperationalError:
        pass
    try:
        conn.execute(
            'CREATE INDEX IF NOT EXISTS idx_rf_fares_train_seat ON rf_fares(train_id, seat_type)'
        )
    except sqlite3.OperationalError:
        pass


def load_stations(conn: sqlite3.Connection) -> dict[str, list[str]]:
    rows = conn.execute(
        "SELECT name, city FROM stations WHERE name IS NOT NULL AND city IS NOT NULL AND TRIM(city) <> ''"
    ).fetchall()
    by_city: dict[str, list[str]] = defaultdict(list)
    for name, city in rows:
        by_city[str(city)].append(str(name))
    by_city = {city: names for city, names in by_city.items() if names}
    if not by_city:
        raise RuntimeError('stations 表为空或缺少 city/name 数据')
    return by_city


def station_display(city: str, station_name: str) -> str:
    return station_name if city in station_name else f'{city}{station_name}'


def rand_time_in_bucket(bucket_idx: int, item_idx: int, per_bucket: int, rng: random.Random) -> str:
    start_minutes = bucket_idx * 360
    step = 360 // per_bucket
    base = start_minutes + item_idx * step
    jitter = rng.randint(0, max(step - 1, 0))
    m = base + jitter
    h = (m // 60) % 24
    mm = m % 60
    return f'{h:02d}:{mm:02d}'


def add_minutes(hhmm: str, minutes: int) -> str:
    h, m = hhmm.split(':')
    total = int(h) * 60 + int(m) + minutes
    total %= 1440
    return f'{total // 60:02d}:{total % 60:02d}'


def duration_text(minutes: int) -> str:
    h = minutes // 60
    m = minutes % 60
    return f'{h}h{m:02d}m'


def seat_payload(rng: random.Random) -> tuple[dict, dict[str, str]]:
    payload: dict[str, dict] = {}
    cols: dict[str, str] = {}

    def gen_one(key: str) -> dict:
        r = rng.random()
        if r < 0.15:
            return {'remaining': 0}
        if r < 0.25:
            return {'remaining': 0, 'backupOnly': True}
        return {'remaining': rng.randint(1, 200)}

    for k in SEAT_KEYS:
        payload[k] = gen_one(k)

    def to_cell(v: dict) -> str:
        if v.get('backupOnly'):
            return '候补'
        return str(int(v.get('remaining', 0)))

    cols['swz_num'] = to_cell(payload['商务座'])
    cols['yd_num'] = to_cell(payload['一等座'])
    cols['ed_num'] = to_cell(payload['二等座'])
    cols['rw_num'] = to_cell(payload['软卧'])
    cols['yw_num'] = to_cell(payload['硬卧'])
    cols['yz_num'] = to_cell(payload['硬座'])
    cols['wz_num'] = to_cell(payload['无座'])

    return payload, cols


def gen_records(
    stations_by_city: dict[str, list[str]],
    dates: list[str],
    per_day_per_pair: int,
    seed_tag: str,
    rng: random.Random,
) -> list[tuple]:
    cities = sorted(stations_by_city.keys())
    per_bucket = max(per_day_per_pair // 4, 1)
    records: list[tuple] = []

    for d in dates:
        for i, from_city in enumerate(cities):
            from_stations = stations_by_city[from_city]
            for j, to_city in enumerate(cities):
                if i == j:
                    continue
                to_stations = stations_by_city[to_city]
                pair_key = f'{from_city}->{to_city}@{d}'
                base_hash = abs(hash(pair_key))

                for bucket in range(4):
                    for k in range(per_bucket):
                        prefix = TRAIN_PREFIXES[(base_hash + bucket + k) % len(TRAIN_PREFIXES)]
                        train_no = f'{prefix}{(base_hash + bucket * 100 + k) % 9000 + 1000:04d}'
                        start_time = rand_time_in_bucket(bucket, k, per_bucket, rng)
                        duration_min = (
                            rng.randint(60, 240)
                            if prefix == 'G'
                            else rng.randint(90, 420)
                            if prefix == 'D'
                            else rng.randint(120, 720)
                        )
                        end_time = add_minutes(start_time, duration_min)

                        start_station_raw = from_stations[(base_hash + bucket + k) % len(from_stations)]
                        end_station_raw = to_stations[(base_hash + bucket + k) % len(to_stations)]
                        start_station = station_display(from_city, start_station_raw)
                        end_station = station_display(to_city, end_station_raw)

                        seat_json, seat_cols = seat_payload(rng)

                        records.append(
                            (
                                train_no,
                                prefix,
                                start_station,
                                end_station,
                                start_time,
                                end_time,
                                duration_text(duration_min),
                                d,
                                seat_cols['swz_num'],
                                seat_cols['yd_num'],
                                seat_cols['ed_num'],
                                seat_cols['rw_num'],
                                seat_cols['yw_num'],
                                seat_cols['yz_num'],
                                seat_cols['wz_num'],
                                json.dumps(seat_json, ensure_ascii=False),
                                seed_tag,
                            )
                        )

    return records


def main() -> int:
    ap = argparse.ArgumentParser()
    default_db = Path(__file__).resolve().parents[1] / 'data' / '12306.db'
    ap.add_argument('--db', default=str(default_db))
    ap.add_argument('--days', type=int, default=15)
    ap.add_argument('--per-day-per-pair', type=int, default=20)
    ap.add_argument('--seed-tag', default='bulk_seed_v1')
    ap.add_argument('--random-seed', type=int, default=3604)
    args = ap.parse_args()

    if args.per_day_per_pair < 20:
        raise SystemExit('--per-day-per-pair 必须 >= 20')
    if args.per_day_per_pair % 4 != 0:
        raise SystemExit('--per-day-per-pair 必须能被 4 整除，以满足四个时段均匀分布')

    rng = random.Random(args.random_seed)
    today = dt.date.today()
    dates = date_range(today, args.days)

    conn = sqlite3.connect(args.db)
    conn.execute('PRAGMA journal_mode=WAL')
    conn.execute('PRAGMA synchronous=NORMAL')
    conn.execute('PRAGMA temp_store=MEMORY')
    conn.execute('PRAGMA cache_size=-200000')
    conn.row_factory = sqlite3.Row

    try:
        ensure_columns(conn)
        stations_by_city = load_stations(conn)
        records = gen_records(stations_by_city, dates, args.per_day_per_pair, args.seed_tag, rng)

        start_date = dates[0]
        end_date = dates[-1]
        with conn:
            conn.execute(
                'DELETE FROM train_tickets WHERE seed_tag = ?',
                (args.seed_tag,),
            )
            conn.executemany(
                """
                INSERT INTO train_tickets (
                  train_no, train_type, start_station, end_station,
                  start_time, end_time, duration, date,
                  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num,
                  seat_availability, seed_tag
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """.strip(),
                records,
            )

            ensure_indexes(conn)

        city_count = len(stations_by_city)
        pair_count = city_count * (city_count - 1)
        print(
            json.dumps(
                {
                    'db': args.db,
                    'seed_tag': args.seed_tag,
                    'cities': city_count,
                    'pairs': pair_count,
                    'days': args.days,
                    'per_day_per_pair': args.per_day_per_pair,
                    'inserted_rows': len(records),
                    'date_range': [start_date, end_date],
                },
                ensure_ascii=False,
            )
        )
    finally:
        conn.close()

    return 0


if __name__ == '__main__':
    raise SystemExit(main())

