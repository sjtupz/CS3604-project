import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './CateringSpecialties.module.css';

type Item = {
  id: string;
  title: string;
  desc: string;
  tags: string[];
};

const staticItems: Item[] = [
  { id: 'i1', title: '京味烤鸭套餐', desc: '经典京味，旅途必尝', tags: ['北京', '烤鸭', 'G103'] },
  { id: 'i2', title: '沪上生煎礼盒', desc: '现做现售，皮薄汁多', tags: ['上海', '生煎'] },
  { id: 'i3', title: '东北烤肠拼盘', desc: '肉香四溢，分量十足', tags: ['长春', '哈尔滨'] },
  { id: 'i4', title: '西北牛肉拉面', desc: '筋道爽滑，暖胃之选', tags: ['兰州', '牛肉面'] },
  { id: 'i5', title: '川味麻辣鸡块', desc: '辣爽开胃，停不下来', tags: ['成都', '麻辣'] },
  { id: 'i6', title: '广式腊味饭', desc: '咸香入味，回味悠长', tags: ['广州', '腊味'] },
];

const CateringSpecialties: React.FC = () => {
  const [date, setDate] = useState('');
  const [trainNo, setTrainNo] = useState('');
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [query, setQuery] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const d = params.get('date') || '';
    const t = params.get('train') || '';
    const f = params.get('from') || '';
    const to = params.get('to') || '';
    setDate(d);
    setTrainNo(t);
    setFromStation(f);
    setToStation(to);
    setQuery([t, f, to].filter(Boolean).join(' '));
  }, [location.search]);

  const filtered = useMemo(() => {
    const q = (query + ' ' + trainNo + ' ' + fromStation + ' ' + toStation).trim().toLowerCase();
    if (!q) return staticItems;
    return staticItems.filter((it) =>
      [it.title, it.desc, ...it.tags].join(' ').toLowerCase().includes(q)
    );
  }, [query, trainNo, fromStation, toStation]);

  return (
    <div className={styles['catering-page']} data-testid="catering-page">
      <div className={styles.hero}>
        <div className={styles.headline}>
          带有温度的旅途配餐，享受星级的体验，
          <br />
          家乡的味道
        </div>
        <div className={styles['search-bar']}>
          <div className={styles.field}>
            <input
              type="date"
              aria-label="日期"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            车次
            <input
              aria-label="车次"
              placeholder="G103"
              value={trainNo}
              onChange={(e) => setTrainNo(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            乘车站
            <input
              aria-label="乘车站"
              placeholder="输入乘车站"
              value={fromStation}
              onChange={(e) => setFromStation(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            到达站
            <input
              aria-label="到达站"
              placeholder="输入到达站"
              value={toStation}
              onChange={(e) => setToStation(e.target.value)}
            />
          </div>
          <button className={styles['search-btn']} onClick={() => setQuery(`${trainNo} ${fromStation} ${toStation}`)}>
            搜索
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles['filter-bar']}>
          <div className={styles['filter-row']}>
            <div className={styles.field}>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className={styles.field}>
              车次
              <input placeholder="G103" value={trainNo} onChange={(e) => setTrainNo(e.target.value)} />
            </div>
            <div className={styles.field}>
              乘车站
              <input placeholder="北京" value={fromStation} onChange={(e) => setFromStation(e.target.value)} />
            </div>
            <div className={styles.field}>
              到达站
              <input placeholder="上海" value={toStation} onChange={(e) => setToStation(e.target.value)} />
            </div>
            <button
              className={styles['search-btn']}
              onClick={() => {
                const params = new URLSearchParams({ date, train: trainNo, from: fromStation, to: toStation });
                navigate(`/catering?${params.toString()}`);
              }}
            >
              查询
            </button>
            <div className={styles.checkbox}>
              <input type="checkbox" id="prebook" checked={onlyAvailable} onChange={(e) => setOnlyAvailable(e.target.checked)} />
              <label htmlFor="prebook">显示可预订商家</label>
            </div>
          </div>
        </div>

        <div className={styles['section-title']}>列车自营商品</div>
        <div className={styles['product-grid']}>
          {[
            { name: '青岛解暑姜汁', price: '¥20.00', size: '160x120' },
            { name: '依云矿泉水', price: '¥13.00', size: '160x120' },
            { name: '杏鲍菇肉香套餐', price: '¥68.00', size: '160x120' },
          ].map((p, i) => (
            <div key={i} className={styles.product}>
              <div className={styles['placeholder-img']}>{p.size} 占位</div>
              <div className={styles['product-info']}>
                <div className={styles['product-name']}>{p.name}</div>
                <div className={styles['product-price']}>{p.price}</div>
              </div>
            </div>
          ))}
        </div>

        {[
          {
            title: '北京南（11-30 06:20开车）',
            merchants: [
              { id: 'subway', name: 'SUBWAY', available: true, meta: '11-16配送' },
              { id: 'kfc', name: 'KFC', available: true, meta: '11-30 05:20准时上下车' },
              { id: 'nantangguan', name: '南堂馆', available: false, meta: '休息中' },
              { id: 'jingtieshitang', name: '京铁食堂', available: false, meta: '休息中' },
            ],
          },
          {
            title: '济南西（11-30 08:04开车）',
            merchants: [
              { id: 'yangguofu', name: '杨国福麻辣烫', available: true, meta: '配送：¥0.00' },
              { id: 'xibei', name: '西贝莜面村', available: false, meta: '休息中' },
              { id: 'xicha', name: '喜茶', available: true, meta: '配送：¥8.00' },
              { id: 'dekeshi', name: '德克士', available: false, meta: '休息中' },
            ],
          },
        ].map((sec, idx) => (
          <div key={idx} className={styles['station-block']}>
            <div className={styles['station-header']}>{sec.title}</div>
            <div className={styles['merchant-row']}>
              {(onlyAvailable ? sec.merchants.filter((m) => m.available) : sec.merchants).map((m) => (
                <div key={m.id} className={styles['merchant']}>
                  <Link
                    to={`/catering/merchant/${m.id}`}
                    className={`${styles['merchant-logo']} ${m.available ? '' : styles['merchant-disabled']}`}
                  >
                    {m.name} 占位
                  </Link>
                  <div className={styles['merchant-meta']}>
                    {m.meta} 
                    <span className={`${styles['status-badge']} ${m.available ? styles['badge-available'] : styles['badge-resting']}`}>
                      {m.available ? '可预订' : '休息中'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className={styles.results}>
          {filtered.map((it) => (
            <div key={it.id} className={styles.card}>
              <div className={styles['card-title']}>{it.title}</div>
              <div className={styles['card-desc']}>{it.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CateringSpecialties;
