# 测试数据字典 (Test Data Dictionary)

## 概述 (Overview)
本目录包含用于测试12306模拟系统的测试数据。数据覆盖全国30个主要省会及直辖市，包含城市、车站、车次及车票信息。

## 文件清单 (File List)
- `test_data.sql`: 标准SQL导入脚本，包含建表语句和数据插入语句。
- `cities.csv`: 城市数据CSV文件。
- `stations.csv`: 车站数据CSV文件。
- `trains.csv`: 车次数据CSV文件。
- `tickets.csv`: 车票数据CSV文件。

## 数据表结构 (Data Structure)

### 1. 城市表 (cities)
包含全国主要城市的基本信息。

| 字段名 (Field) | 类型 (Type) | 描述 (Description) | 示例 (Example) |
| :--- | :--- | :--- | :--- |
| id | INTEGER | 城市唯一标识 | 1 |
| name | TEXT | 城市名称 | 北京 |
| pinyin | TEXT | 城市拼音 | beijing |
| province | TEXT | 所属省份 | 北京 |
| lat | REAL | 纬度 | 39.9042 |
| lng | REAL | 经度 | 116.4074 |

### 2. 车站表 (stations)
包含各城市的火车站信息。

| 字段名 (Field) | 类型 (Type) | 描述 (Description) | 示例 (Example) |
| :--- | :--- | :--- | :--- |
| id | INTEGER | 车站唯一标识 | 1 |
| name | TEXT | 车站名称 | 北京南站 |
| city_id | INTEGER | 所属城市ID (关联cities.id) | 1 |
| level | TEXT | 车站等级 | 特等站 |
| type | TEXT | 车站类型 | rail |
| is_hot | BOOLEAN | 是否热门车站 | 1 (True) |

### 3. 车次表 (trains)
包含城市间的列车班次信息。

| 字段名 (Field) | 类型 (Type) | 描述 (Description) | 示例 (Example) |
| :--- | :--- | :--- | :--- |
| id | INTEGER | 车次唯一标识 | 1 |
| train_number | TEXT | 车次号 | G101 |
| train_type | TEXT | 车型 (G/D/Z/T/K) | G |
| start_station_id | INTEGER | 始发站ID (关联stations.id) | 1 |
| end_station_id | INTEGER | 终点站ID (关联stations.id) | 2 |

### 4. 车票表 (tickets)
包含特定日期的车次余票及价格信息（本测试数据为模拟单一日期快照）。

| 字段名 (Field) | 类型 (Type) | 描述 (Description) | 示例 (Example) |
| :--- | :--- | :--- | :--- |
| id | INTEGER | 车票唯一标识 | 1 |
| train_id | INTEGER | 所属车次ID (关联trains.id) | 1 |
| from_station_id | INTEGER | 出发站ID | 1 |
| to_station_id | INTEGER | 到达站ID | 2 |
| departure_time | TEXT | 发车时间 (HH:mm) | 08:00 |
| arrival_time | TEXT | 到达时间 (HH:mm) | 12:30 |
| duration | TEXT | 历时 | 4h30m |
| swz_num | INTEGER | 商务座余票 | 5 |
| swz_price | INTEGER | 商务座价格 | 1500 |
| yd_num | INTEGER | 一等座余票 | 20 |
| yd_price | INTEGER | 一等座价格 | 800 |
| ed_num | INTEGER | 二等座余票 | 100 |
| ed_price | INTEGER | 二等座价格 | 500 |
| ... | ... | (包含其他席别: 软卧rw, 硬卧yw, 硬座yz, 无座wz) | ... |

## 数据统计 (Statistics)
- 城市数量: 30个
- 车站数量: 约60-90个
- 车次数量: 1000+条
- 覆盖车型: 高铁(G), 动车(D), 直达(Z), 特快(T), 快速(K)

## 注意事项 (Notes)
- SQL脚本会自动删除已存在的同名表 (`cities`, `stations`, `trains`, `tickets`)，请在生产环境中谨慎使用。
- 车票数据为随机生成，价格基于历时和车型估算，非真实票价。
