PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS stations;
DROP TABLE IF EXISTS trains;
DROP TABLE IF EXISTS timetables;
DROP TABLE IF EXISTS fares;
DROP TABLE IF EXISTS inventories;

CREATE TABLE stations (
  station_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  level TEXT,
  latitude REAL,
  longitude REAL
);

CREATE TABLE trains (
  train_id INTEGER PRIMARY KEY,
  train_number TEXT NOT NULL UNIQUE,
  train_type TEXT NOT NULL,
  origin_station_id INTEGER NOT NULL,
  destination_station_id INTEGER NOT NULL,
  distance_km REAL NOT NULL,
  duration_minutes INTEGER NOT NULL,
  stop_count INTEGER NOT NULL,
  FOREIGN KEY(origin_station_id) REFERENCES stations(station_id),
  FOREIGN KEY(destination_station_id) REFERENCES stations(station_id)
);

CREATE TABLE timetables (
  schedule_id INTEGER PRIMARY KEY,
  train_id INTEGER NOT NULL,
  station_id INTEGER NOT NULL,
  arrival_time TEXT NOT NULL,
  departure_time TEXT NOT NULL,
  stop_minutes INTEGER NOT NULL,
  stop_order INTEGER NOT NULL,
  FOREIGN KEY(train_id) REFERENCES trains(train_id),
  FOREIGN KEY(station_id) REFERENCES stations(station_id)
);

CREATE TABLE fares (
  fare_id INTEGER PRIMARY KEY,
  train_id INTEGER NOT NULL,
  seat_type TEXT NOT NULL,
  base_price REAL NOT NULL,
  coef REAL NOT NULL,
  FOREIGN KEY(train_id) REFERENCES trains(train_id)
);

CREATE TABLE inventories (
  stock_id INTEGER PRIMARY KEY,
  train_id INTEGER NOT NULL,
  travel_date TEXT NOT NULL,
  from_station_id INTEGER NOT NULL,
  to_station_id INTEGER NOT NULL,
  business_remaining INTEGER,
  first_remaining INTEGER,
  second_remaining INTEGER,
  soft_sleeper_remaining INTEGER,
  hard_sleeper_remaining INTEGER,
  hard_seat_remaining INTEGER,
  no_seat_remaining INTEGER,
  other_remaining INTEGER,
  FOREIGN KEY(train_id) REFERENCES trains(train_id),
  FOREIGN KEY(from_station_id) REFERENCES stations(station_id),
  FOREIGN KEY(to_station_id) REFERENCES stations(station_id)
);

CREATE INDEX idx_stations_city ON stations(city);
CREATE INDEX idx_stations_province ON stations(province);
CREATE INDEX idx_trains_type ON trains(train_type);
CREATE INDEX idx_trains_origin ON trains(origin_station_id);
CREATE INDEX idx_trains_destination ON trains(destination_station_id);
CREATE INDEX idx_timetables_train ON timetables(train_id);
CREATE INDEX idx_timetables_station ON timetables(station_id);
CREATE INDEX idx_inventories_date ON inventories(travel_date);
CREATE INDEX idx_inventories_train ON inventories(train_id);

CREATE TEMP TABLE base_cities(city TEXT, province TEXT);
INSERT INTO base_cities(city, province) VALUES
('北京','北京'),('上海','上海'),('天津','天津'),('重庆','重庆'),
('广州','广东'),('深圳','广东'),('珠海','广东'),('佛山','广东'),('东莞','广东'),('中山','广东'),('惠州','广东'),('江门','广东'),('湛江','广东'),('汕头','广东'),('揭阳','广东'),('茂名','广东'),('肇庆','广东'),('梅州','广东'),
('南京','江苏'),('苏州','江苏'),('无锡','江苏'),('常州','江苏'),('南通','江苏'),('扬州','江苏'),('泰州','江苏'),('盐城','江苏'),('徐州','江苏'),('淮安','江苏'),('连云港','江苏'),
('杭州','浙江'),('宁波','浙江'),('温州','浙江'),('金华','浙江'),('嘉兴','浙江'),('绍兴','浙江'),('台州','浙江'),('湖州','浙江'),('丽水','浙江'),
('福州','福建'),('厦门','福建'),('泉州','福建'),('莆田','福建'),('漳州','福建'),('龙岩','福建'),('宁德','福建'),
('合肥','安徽'),('芜湖','安徽'),('蚌埠','安徽'),('马鞍山','安徽'),('安庆','安徽'),('阜阳','安徽'),('亳州','安徽'),('淮南','安徽'),('滁州','安徽'),('宿州','安徽'),('六安','安徽'),
('南昌','江西'),('赣州','江西'),('九江','江西'),('景德镇','江西'),('萍乡','江西'),('新余','江西'),('宜春','江西'),('上饶','江西'),('抚州','江西'),
('武汉','湖北'),('宜昌','湖北'),('襄阳','湖北'),('黄石','湖北'),('荆州','湖北'),('十堰','湖北'),('孝感','湖北'),('黄冈','湖北'),
('长沙','湖南'),('株洲','湖南'),('湘潭','湖南'),('衡阳','湖南'),('岳阳','湖南'),('常德','湖南'),('益阳','湖南'),('郴州','湖南'),('永州','湖南'),('怀化','湖南'),
('郑州','河南'),('洛阳','河南'),('开封','河南'),('新乡','河南'),('安阳','河南'),('许昌','河南'),('南阳','河南'),('焦作','河南'),('商丘','河南'),('信阳','河南'),
('济南','山东'),('青岛','山东'),('淄博','山东'),('烟台','山东'),('潍坊','山东'),('威海','山东'),('泰安','山东'),('临沂','山东'),('德州','山东'),('聊城','山东'),
('石家庄','河北'),('唐山','河北'),('秦皇岛','河北'),('邯郸','河北'),('邢台','河北'),('保定','河北'),('张家口','河北'),('承德','河北'),('沧州','河北'),('廊坊','河北'),
('太原','山西'),('大同','山西'),('晋中','山西'),('长治','山西'),('阳泉','山西'),('临汾','山西'),('运城','山西'),
('西安','陕西'),('咸阳','陕西'),('渭南','陕西'),('宝鸡','陕西'),('汉中','陕西'),('安康','陕西'),('延安','陕西'),
('兰州','甘肃'),('庆阳','甘肃'),('酒泉','甘肃'),('张掖','甘肃'),('武威','甘肃'),('天水','甘肃'),
('西宁','青海'),('海东','青海'),
('银川','宁夏'),('吴忠','宁夏'),('石嘴山','宁夏'),
('乌鲁木齐','新疆'),('克拉玛依','新疆'),('喀什','新疆'),('库尔勒','新疆'),('伊宁','新疆'),('哈密','新疆'),
('拉萨','西藏'),('林芝','西藏'),('日喀则','西藏'),
('呼和浩特','内蒙古'),('包头','内蒙古'),('鄂尔多斯','内蒙古'),('巴彦淖尔','内蒙古'),('通辽','内蒙古'),
('沈阳','辽宁'),('大连','辽宁'),('鞍山','辽宁'),('抚顺','辽宁'),('本溪','辽宁'),('锦州','辽宁'),('营口','辽宁'),('盘锦','辽宁'),
('长春','吉林'),('吉林','吉林'),('延边','吉林'),
('哈尔滨','黑龙江'),('齐齐哈尔','黑龙江'),('牡丹江','黑龙江'),('佳木斯','黑龙江'),('大庆','黑龙江'),
('成都','四川'),('绵阳','四川'),('德阳','四川'),('乐山','四川'),('宜宾','四川'),('泸州','四川'),('南充','四川'),('达州','四川'),('遂宁','四川'),
('昆明','云南'),('曲靖','云南'),('玉溪','云南'),('大理','云南'),('丽江','云南'),('保山','云南'),('昭通','云南'),
('贵阳','贵州'),('遵义','贵州'),('安顺','贵州'),
('南宁','广西'),('柳州','广西'),('桂林','广西'),('北海','广西'),('钦州','广西'),('防城港','广西'),
('海口','海南'),('三亚','海南');

INSERT INTO stations(name, code, city, province, level, latitude, longitude)
SELECT city || suf,
       'PENDING',
       city,
       province,
       CASE WHEN suf IN ('高铁站','虹桥') THEN '特等' ELSE CASE WHEN (abs(random()) % 3) = 0 THEN '一等' ELSE '二等' END END,
       20 + (abs(random()) % 3000) / 100.0,
       85 + (abs(random()) % 5000) / 100.0
FROM base_cities
CROSS JOIN (VALUES ('站'),('东站'),('西站'),('南站'),('北站'),('虹桥'),('高铁站')) AS s(suf);

UPDATE stations SET code = 'ST' || printf('%04d', station_id);

WITH RECURSIVE seq(n) AS (
  SELECT 1
  UNION ALL
  SELECT n+1 FROM seq WHERE n < 5500
),
types AS (
  SELECT n,
         CASE n % 7 WHEN 0 THEN 'G' WHEN 1 THEN 'D' WHEN 2 THEN 'C' WHEN 3 THEN 'Z' WHEN 4 THEN 'T' WHEN 5 THEN 'K' ELSE '普快' END AS train_type
  FROM seq
),
orig AS (
  SELECT t.n,
         (SELECT station_id FROM stations WHERE ((t.train_type IN ('G','D','C') AND (name LIKE '%高铁站%' OR name LIKE '%虹桥%')) OR (t.train_type NOT IN ('G','D','C'))) ORDER BY random() LIMIT 1) AS origin_id
  FROM types t
),
dest AS (
  SELECT t.n, t.train_type, o.origin_id,
         (SELECT station_id FROM stations WHERE station_id != o.origin_id AND ((t.train_type IN ('G','D','C') AND (name LIKE '%高铁站%' OR name LIKE '%虹桥%')) OR (t.train_type NOT IN ('G','D','C'))) ORDER BY random() LIMIT 1) AS dest_id
  FROM types t JOIN orig o ON t.n = o.n
)
INSERT INTO trains(train_number, train_type, origin_station_id, destination_station_id, distance_km, duration_minutes, stop_count)
SELECT
  CASE train_type
    WHEN 'G' THEN 'G' || printf('%04d', 1000 + n)
    WHEN 'D' THEN 'D' || printf('%04d', 2000 + n)
    WHEN 'C' THEN 'C' || printf('%04d', 3000 + n)
    WHEN 'Z' THEN 'Z' || printf('%04d', 4000 + n)
    WHEN 'T' THEN 'T' || printf('%04d', 5000 + n)
    WHEN 'K' THEN 'K' || printf('%04d', 6000 + n)
    ELSE 'P' || printf('%04d', 7000 + n)
  END AS train_number,
  train_type,
  origin_id,
  dest_id,
  CAST((abs(random()) % 2500) + 100 AS REAL) AS distance_km,
  CASE train_type
    WHEN 'G' THEN ((abs(random()) % 6) + 8) * 60
    WHEN 'D' THEN ((abs(random()) % 8) + 10) * 60
    WHEN 'C' THEN ((abs(random()) % 6) + 8) * 60
    WHEN 'Z' THEN ((abs(random()) % 16) + 12) * 60
    WHEN 'T' THEN ((abs(random()) % 18) + 14) * 60
    WHEN 'K' THEN ((abs(random()) % 24) + 16) * 60
    ELSE ((abs(random()) % 36) + 24) * 60
  END + (abs(random()) % 120) AS duration_minutes,
  (abs(random()) % 18) + 10 AS stop_count
FROM dest;

UPDATE trains SET duration_minutes = duration_minutes + 1440 WHERE train_type IN ('K','普快') AND (train_id % 10) = 0;

WITH RECURSIVE stops(train_id, stop_order, stop_count) AS (
  SELECT train_id, 1, stop_count FROM trains
  UNION ALL
  SELECT train_id, stop_order + 1, stop_count FROM stops WHERE stop_order < stop_count
)
INSERT INTO timetables(train_id, station_id, arrival_time, departure_time, stop_minutes, stop_order)
SELECT tr.train_id,
       CASE
         WHEN s.stop_order = 1 THEN tr.origin_station_id
         WHEN s.stop_order = tr.stop_count THEN tr.destination_station_id
         ELSE (SELECT station_id FROM stations WHERE ((tr.train_type IN ('G','D','C') AND (name LIKE '%高铁站%' OR name LIKE '%虹桥%')) OR (tr.train_type NOT IN ('G','D','C'))) ORDER BY random() LIMIT 1)
       END AS station_id,
       printf('%02d:%02d', (((((tr.train_id*37) % 1080) + 300) + (s.stop_order-1) * CASE tr.train_type WHEN 'G' THEN 20 WHEN 'D' THEN 25 WHEN 'C' THEN 30 WHEN 'Z' THEN 40 WHEN 'T' THEN 45 WHEN 'K' THEN 60 ELSE 65 END) / 60) % 24,
                          (((((tr.train_id*37) % 1080) + 300) + (s.stop_order-1) * CASE tr.train_type WHEN 'G' THEN 20 WHEN 'D' THEN 25 WHEN 'C' THEN 30 WHEN 'Z' THEN 40 WHEN 'T' THEN 45 WHEN 'K' THEN 60 ELSE 65 END) % 60)),
       printf('%02d:%02d', (((((tr.train_id*37) % 1080) + 300) + (s.stop_order-1) * CASE tr.train_type WHEN 'G' THEN 20 WHEN 'D' THEN 25 WHEN 'C' THEN 30 WHEN 'Z' THEN 40 WHEN 'T' THEN 45 WHEN 'K' THEN 60 ELSE 65 END + 5) / 60) % 24,
                          (((((tr.train_id*37) % 1080) + 300) + (s.stop_order-1) * CASE tr.train_type WHEN 'G' THEN 20 WHEN 'D' THEN 25 WHEN 'C' THEN 30 WHEN 'Z' THEN 40 WHEN 'T' THEN 45 WHEN 'K' THEN 60 ELSE 65 END + 5) % 60)),
       5 AS stop_minutes,
       s.stop_order
FROM stops s
JOIN trains tr ON tr.train_id = s.train_id;

WITH seat_types AS (
  SELECT '商务' AS seat_type, 1.80 AS coef, 'G' AS applicable
  UNION ALL SELECT '一等', 1.40, 'G'
  UNION ALL SELECT '二等', 1.10, 'G'
  UNION ALL SELECT '商务', 1.70, 'D'
  UNION ALL SELECT '一等', 1.30, 'D'
  UNION ALL SELECT '二等', 1.00, 'D'
  UNION ALL SELECT '一等', 1.20, 'C'
  UNION ALL SELECT '二等', 0.95, 'C'
  UNION ALL SELECT '软卧', 1.60, 'Z'
  UNION ALL SELECT '硬卧', 1.30, 'Z'
  UNION ALL SELECT '硬座', 0.80, 'Z'
  UNION ALL SELECT '无座', 0.70, 'Z'
  UNION ALL SELECT '软卧', 1.60, 'T'
  UNION ALL SELECT '硬卧', 1.30, 'T'
  UNION ALL SELECT '硬座', 0.80, 'T'
  UNION ALL SELECT '无座', 0.70, 'T'
  UNION ALL SELECT '软卧', 1.60, 'K'
  UNION ALL SELECT '硬卧', 1.30, 'K'
  UNION ALL SELECT '硬座', 0.80, 'K'
  UNION ALL SELECT '无座', 0.70, 'K'
  UNION ALL SELECT '软卧', 1.60, '普快'
  UNION ALL SELECT '硬卧', 1.30, '普快'
  UNION ALL SELECT '硬座', 0.80, '普快'
  UNION ALL SELECT '无座', 0.70, '普快'
)
INSERT INTO fares(train_id, seat_type, base_price, coef)
SELECT tr.train_id,
       st.seat_type,
       ROUND(tr.distance_km * st.coef * CASE tr.train_type WHEN 'G' THEN 0.28 WHEN 'D' THEN 0.26 WHEN 'C' THEN 0.24 WHEN 'Z' THEN 0.20 WHEN 'T' THEN 0.18 WHEN 'K' THEN 0.16 ELSE 0.15 END, 2) AS base_price,
       st.coef
FROM trains tr JOIN seat_types st ON st.applicable = tr.train_type;

WITH RECURSIVE dates(d) AS (
  SELECT date('now')
  UNION ALL
  SELECT date(d, '+1 day') FROM dates WHERE d < date('now', '+29 day')
)
INSERT INTO inventories(train_id, travel_date, from_station_id, to_station_id, business_remaining, first_remaining, second_remaining, soft_sleeper_remaining, hard_sleeper_remaining, hard_seat_remaining, no_seat_remaining, other_remaining)
SELECT tr.train_id,
       dates.d,
       tr.origin_station_id,
       tr.destination_station_id,
       CASE WHEN tr.train_type IN ('G','D','C') THEN CASE WHEN (abs(random()) % 20) = 0 THEN 0 ELSE (abs(random()) % 30) END ELSE 0 END AS business_remaining,
       CASE WHEN tr.train_type IN ('G','D','C') THEN CASE WHEN (abs(random()) % 25) = 0 THEN 0 ELSE (abs(random()) % 80) END ELSE 0 END AS first_remaining,
       CASE WHEN tr.train_type IN ('G','D','C') THEN CASE WHEN (abs(random()) % 25) = 0 THEN 0 ELSE (abs(random()) % 120) END ELSE 0 END AS second_remaining,
       CASE WHEN tr.train_type IN ('Z','T','K','普快') THEN CASE WHEN (abs(random()) % 25) = 0 THEN 0 ELSE (abs(random()) % 60) END ELSE 0 END AS soft_sleeper_remaining,
       CASE WHEN tr.train_type IN ('Z','T','K','普快') THEN CASE WHEN (abs(random()) % 25) = 0 THEN 0 ELSE (abs(random()) % 90) END ELSE 0 END AS hard_sleeper_remaining,
       CASE WHEN tr.train_type IN ('Z','T','K','普快') THEN CASE WHEN (abs(random()) % 20) = 0 THEN 0 ELSE (abs(random()) % 200) END ELSE 0 END AS hard_seat_remaining,
       CASE WHEN tr.train_type IN ('Z','T','K','普快') THEN CASE WHEN (abs(random()) % 30) = 0 THEN 0 ELSE (abs(random()) % 120) END ELSE 0 END AS no_seat_remaining,
       CASE WHEN (abs(random()) % 25) = 0 THEN 0 ELSE (abs(random()) % 50) END AS other_remaining
FROM trains tr
CROSS JOIN dates;

SELECT 'stations' AS table_name, COUNT(*) AS total FROM stations;
SELECT 'trains' AS table_name, COUNT(*) AS total FROM trains;
SELECT 'timetables' AS table_name, COUNT(*) AS total FROM timetables;
SELECT 'fares' AS table_name, COUNT(*) AS total FROM fares;
SELECT 'inventories' AS table_name, COUNT(*) AS total FROM inventories;
