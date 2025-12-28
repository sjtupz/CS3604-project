
DROP TABLE IF EXISTS train_tickets;
CREATE TABLE train_tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  train_no TEXT,
  train_type TEXT,
  start_station TEXT,
  end_station TEXT,
  start_time TEXT,
  end_time TEXT,
  duration TEXT,
  date TEXT,
  swz_num TEXT,
  yd_num TEXT,
  ed_num TEXT,
  rw_num TEXT,
  yw_num TEXT,
  yz_num TEXT,
  wz_num TEXT
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K7555', 'K', '重庆', '佛山',
  '20:06', '21:28', '1:22', '2025-12-23',
  '12', '15', '0', NULL, '13', '16', '14'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K1353', 'K', '佛山', '重庆',
  '21:14', '22:36', '1:22', '2025-12-24',
  '候补', '9', '16', '0', '6', '15', '19'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z3813', 'Z', '苏州', '大连',
  '22:54', '07:24', '8:30', '2025-12-17',
  '14', '16', '7', '6', '20', '7', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z1462', 'Z', '大连', '苏州',
  '11:38', '20:08', '8:30', '2025-12-19',
  '1', '2', '0', '有', '4', '6', '6'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D8484', 'D', '天津西', '佛山',
  '13:57', '23:29', '9:32', '2025-12-22',
  '有', '20', '6', '0', '1', '候补', '18'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D311', 'D', '佛山', '天津西',
  '18:44', '04:16', '9:32', '2025-12-24',
  '7', NULL, '1', NULL, '9', NULL, '3'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z9231', 'Z', '福州', '重庆',
  '15:43', '00:26', '8:43', '2025-12-13',
  '18', '有', '4', '10', '8', '候补', '1'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z9186', 'Z', '重庆', '福州',
  '22:35', '07:18', '8:43', '2025-12-15',
  '16', '11', '16', '17', '候补', NULL, '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K3019', 'K', '青岛北', '长沙',
  '12:00', '19:29', '7:29', '2025-12-19',
  '17', '9', '6', NULL, '17', '11', '17'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K503', 'K', '长沙', '青岛北',
  '19:48', '03:17', '7:29', '2025-12-20',
  '14', '3', '13', '9', '0', '3', '12'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G6165', 'G', '昆明', '青岛',
  '14:47', '16:14', '1:27', '2025-12-15',
  '8', '13', '10', '1', '有', '18', '5'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G4401', 'G', '青岛', '昆明',
  '19:46', '21:13', '1:27', '2025-12-15',
  '14', '6', '候补', '16', '20', '16', '8'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D2188', 'D', '福州', '南宁',
  '08:45', '18:01', '9:16', '2025-12-25',
  '3', '16', NULL, '15', '12', '6', '9'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D6709', 'D', '南宁', '福州',
  '07:52', '17:08', '9:16', '2025-12-26',
  '14', '0', '4', '0', '有', '6', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z4353', 'Z', '重庆北', '济南东',
  '12:51', '14:12', '1:21', '2025-12-16',
  '20', '9', '18', '有', '候补', '7', '1'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z6160', 'Z', '济南东', '重庆北',
  '19:28', '20:49', '1:21', '2025-12-16',
  '20', '15', '11', '候补', '11', '候补', '18'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z6164', 'Z', '南宁', '石家庄北',
  '18:55', '02:02', '7:07', '2025-12-23',
  '候补', '13', '3', '3', '14', '20', '0'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z3629', 'Z', '石家庄北', '南宁',
  '13:13', '20:20', '7:07', '2025-12-25',
  NULL, '19', '10', NULL, '12', '2', '0'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G8265', 'G', '成都', '长沙',
  '22:40', '07:46', '9:06', '2025-12-20',
  '12', '13', '11', '13', '9', '9', '16'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G5335', 'G', '长沙', '成都',
  '08:49', '17:55', '9:06', '2025-12-21',
  '有', '候补', '0', NULL, '19', '有', '17'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G9498', 'G', '武汉', '佛山西',
  '17:45', '18:55', '1:10', '2025-12-23',
  '候补', NULL, '4', '3', '候补', '15', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G1548', 'G', '佛山西', '武汉',
  '10:20', '11:30', '1:10', '2025-12-23',
  '4', '有', '候补', '13', '2', '10', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G7861', 'G', '青岛北', '海口',
  '14:26', '23:49', '9:23', '2025-12-15',
  '候补', NULL, '17', '7', '5', '6', '8'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G6875', 'G', '海口', '青岛北',
  '13:10', '22:33', '9:23', '2025-12-16',
  '候补', '候补', '17', '16', NULL, '有', '19'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D2632', 'D', '西安北', '苏州北',
  '12:58', '19:14', '6:16', '2025-12-15',
  '15', '有', '有', '14', NULL, '20', '2'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D654', 'D', '苏州北', '西安北',
  '07:28', '13:44', '6:16', '2025-12-15',
  '17', '9', '2', NULL, NULL, '5', '10'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D4068', 'D', '苏州', '成都东',
  '15:31', '22:56', '7:25', '2025-12-13',
  '5', NULL, NULL, '2', '12', NULL, '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D8815', 'D', '成都东', '苏州',
  '12:49', '20:14', '7:25', '2025-12-13',
  '1', '15', '0', '19', '19', '14', '2'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z7759', 'Z', '南京', '厦门',
  '09:10', '18:39', '9:29', '2025-12-19',
  '有', '2', '12', NULL, '10', '5', '9'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z3386', 'Z', '厦门', '南京',
  '06:41', '16:10', '9:29', '2025-12-20',
  '6', '17', '9', '候补', '16', '10', '10'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K3212', 'K', '厦门北', '深圳',
  '13:12', '16:00', '2:48', '2025-12-23',
  '18', '有', '1', '有', '9', NULL, '7'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K9045', 'K', '深圳', '厦门北',
  '16:46', '19:34', '2:48', '2025-12-25',
  '20', '6', '20', '有', NULL, '17', '14'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G337', 'G', '长沙南', '杭州东',
  '13:10', '14:48', '1:38', '2025-12-25',
  NULL, '4', NULL, NULL, '有', '9', '17'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G7213', 'G', '杭州东', '长沙南',
  '22:32', '00:10', '1:38', '2025-12-25',
  '15', '6', '17', NULL, '17', '20', '12'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K8541', 'K', '北京西', '苏州',
  '22:09', '03:30', '5:21', '2025-12-21',
  '11', '3', '18', NULL, '有', '12', '13'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K9821', 'K', '苏州', '北京西',
  '06:15', '11:36', '5:21', '2025-12-22',
  '有', '13', '14', '16', '4', '2', '8'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z1933', 'Z', '青岛北', '佛山西',
  '10:43', '19:49', '9:06', '2025-12-27',
  '2', '5', '9', '7', '10', '候补', '6'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z3377', 'Z', '佛山西', '青岛北',
  '18:31', '03:37', '9:06', '2025-12-27',
  '9', '有', '6', '18', '9', '有', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G8584', 'G', '南宁', '合肥',
  '16:38', '22:31', '5:53', '2025-12-27',
  '候补', '候补', '4', '20', '2', NULL, '2'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G3168', 'G', '合肥', '南宁',
  '16:53', '22:46', '5:53', '2025-12-28',
  '3', '6', '8', '6', '16', '14', '3'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D1805', 'D', '郑州东', '天津',
  '22:20', '07:25', '9:05', '2025-12-23',
  '19', '7', '4', '11', '2', '9', '11'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D7265', 'D', '天津', '郑州东',
  '11:31', '20:36', '9:05', '2025-12-23',
  '13', '有', '0', NULL, '候补', '9', '3'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D5264', 'D', '长春', '大连北',
  '06:27', '14:09', '7:42', '2025-12-27',
  '10', '候补', '6', '17', '14', '15', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D6468', 'D', '大连北', '长春',
  '15:34', '23:16', '7:42', '2025-12-28',
  '10', '0', '4', '6', '有', '14', '12'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K8565', 'K', '乌鲁木齐', '济南东',
  '19:29', '00:31', '5:02', '2025-12-24',
  '10', '9', '有', '13', '7', '候补', '10'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K396', 'K', '济南东', '乌鲁木齐',
  '07:45', '12:47', '5:02', '2025-12-24',
  '7', '20', '有', NULL, '有', '15', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G8656', 'G', '厦门', '西安',
  '15:49', '20:08', '4:19', '2025-12-18',
  '4', '12', '有', '9', '有', '15', '6'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G6434', 'G', '西安', '厦门',
  '10:09', '14:28', '4:19', '2025-12-18',
  '候补', '候补', '13', '14', '有', '候补', '12'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z1136', 'Z', '昆明', '合肥南',
  '09:13', '13:27', '4:14', '2025-12-24',
  '17', '19', '有', '17', '19', '有', '10'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z3550', 'Z', '合肥南', '昆明',
  '15:47', '20:01', '4:14', '2025-12-25',
  '18', '20', '8', '13', '19', '12', '7'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z561', 'Z', '昆明', '北京丰台',
  '18:04', '04:04', '10:00', '2025-12-19',
  '20', '12', '17', '1', NULL, '3', '8'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z4536', 'Z', '北京丰台', '昆明',
  '14:02', '00:02', '10:00', '2025-12-19',
  '18', '候补', '候补', NULL, '15', '候补', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D5224', 'D', '大连北', '合肥',
  '20:46', '05:03', '8:17', '2025-12-22',
  '1', '11', '12', '20', '有', '18', '6'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D6561', 'D', '合肥', '大连北',
  '14:56', '23:13', '8:17', '2025-12-22',
  '14', '17', '候补', '15', NULL, '12', '8'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D8999', 'D', '成都南', '济南',
  '13:21', '21:27', '8:06', '2025-12-18',
  '17', '12', '有', '16', '7', '候补', '0'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D7680', 'D', '济南', '成都南',
  '06:25', '14:31', '8:06', '2025-12-19',
  '候补', '7', '8', '7', '3', '17', '20'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G6563', 'G', '兰州西', '哈尔滨西',
  '07:39', '13:05', '5:26', '2025-12-17',
  '16', '9', '候补', '17', '12', '16', '4'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G4316', 'G', '哈尔滨西', '兰州西',
  '06:32', '11:58', '5:26', '2025-12-17',
  '14', '7', NULL, '20', '8', '17', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z2916', 'Z', '昆明', '广州东',
  '08:22', '11:35', '3:13', '2025-12-22',
  '11', NULL, '8', '有', '7', '17', '11'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z5683', 'Z', '广州东', '昆明',
  '12:47', '16:00', '3:13', '2025-12-22',
  '16', NULL, NULL, '8', '14', '有', '4'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G4826', 'G', '北京丰台', '广州东',
  '16:07', '22:08', '6:01', '2025-12-24',
  NULL, '14', NULL, '候补', '10', '13', '4'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G7729', 'G', '广州东', '北京丰台',
  '21:27', '03:28', '6:01', '2025-12-26',
  '14', '9', '10', '10', '1', '候补', '13'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D1576', 'D', '厦门', '北京丰台',
  '07:42', '10:28', '2:46', '2025-12-20',
  '11', NULL, '0', '16', '有', '2', '19'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D9587', 'D', '北京丰台', '厦门',
  '06:36', '09:22', '2:46', '2025-12-22',
  '10', '18', '20', '6', '7', '8', '15'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G8829', 'G', '太原', '郑州东',
  '19:41', '03:28', '7:47', '2025-12-15',
  '11', '13', '3', NULL, '19', '12', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G8470', 'G', '郑州东', '太原',
  '21:28', '05:15', '7:47', '2025-12-16',
  '有', '9', '候补', '13', '8', '20', '7'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D9394', 'D', '西安', '兰州',
  '19:21', '21:02', '1:41', '2025-12-23',
  '0', '16', '9', '有', '候补', '12', '18'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D211', 'D', '兰州', '西安',
  '20:58', '22:39', '1:41', '2025-12-23',
  '候补', '6', '2', '9', '19', '9', '11'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G4859', 'G', '贵阳北', '天津西',
  '09:14', '11:25', '2:11', '2025-12-27',
  '17', '有', NULL, NULL, '19', '17', '19'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G7605', 'G', '天津西', '贵阳北',
  '06:53', '09:04', '2:11', '2025-12-27',
  '18', '候补', '1', '6', '15', NULL, '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G3076', 'G', '太原', '海口',
  '09:47', '19:47', '10:00', '2025-12-13',
  NULL, '7', '12', '6', NULL, '10', '13'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G4266', 'G', '海口', '太原',
  '19:12', '05:12', '10:00', '2025-12-15',
  '有', '有', NULL, '6', '16', '14', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D1819', 'D', '上海松江', '长沙南',
  '13:46', '19:17', '5:31', '2025-12-22',
  '12', '5', '17', '0', '18', '20', '15'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D3647', 'D', '长沙南', '上海松江',
  '21:24', '02:55', '5:31', '2025-12-22',
  '有', '有', '候补', '15', '2', '候补', '19'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z2490', 'Z', '乌鲁木齐南', '广州南',
  '09:31', '10:39', '1:08', '2025-12-15',
  '候补', '14', '5', '2', '18', '候补', '13'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z6954', 'Z', '广州南', '乌鲁木齐南',
  '11:20', '12:28', '1:08', '2025-12-15',
  '6', NULL, '5', '15', '11', '17', '20'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K1841', 'K', '郑州', '重庆',
  '17:55', '02:32', '8:37', '2025-12-22',
  '7', '5', '8', '有', '候补', '13', '17'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K6061', 'K', '重庆', '郑州',
  '21:57', '06:34', '8:37', '2025-12-23',
  NULL, NULL, '10', '6', '16', '6', '6'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z7485', 'Z', '贵阳', '长沙',
  '20:09', '05:12', '9:03', '2025-12-20',
  NULL, '9', '6', NULL, '1', NULL, '15'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z4947', 'Z', '长沙', '贵阳',
  '14:08', '23:11', '9:03', '2025-12-20',
  '17', '候补', '16', '11', '候补', '15', '1'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K3193', 'K', '杭州南', '石家庄北',
  '08:20', '15:37', '7:17', '2025-12-16',
  '7', '9', '9', '13', '有', NULL, '11'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K915', 'K', '石家庄北', '杭州南',
  '08:49', '16:06', '7:17', '2025-12-17',
  '0', '候补', '6', '7', '候补', '10', '7'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z8069', 'Z', '天津', '大连北',
  '12:57', '18:48', '5:51', '2025-12-26',
  '候补', NULL, '1', '7', '4', '候补', '16'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z5475', 'Z', '大连北', '天津',
  '15:25', '21:16', '5:51', '2025-12-27',
  '19', '8', '有', '候补', '15', '9', '9'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G9855', 'G', '宁波东', '天津西',
  '15:06', '18:27', '3:21', '2025-12-21',
  '11', '16', '5', '12', '2', '10', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G992', 'G', '天津西', '宁波东',
  '19:48', '23:09', '3:21', '2025-12-22',
  '13', '17', '19', '候补', NULL, '10', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K5115', 'K', '济南西', '北京',
  '16:33', '21:52', '5:19', '2025-12-22',
  '1', '4', '20', '8', '18', '有', '2'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K7126', 'K', '北京', '济南西',
  '14:28', '19:47', '5:19', '2025-12-23',
  '8', '15', '10', '4', '6', '14', '5'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z7007', 'Z', '南京南', '长沙',
  '16:31', '21:38', '5:07', '2025-12-18',
  '5', NULL, '10', '候补', NULL, '10', '2'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z5243', 'Z', '长沙', '南京南',
  '12:18', '17:25', '5:07', '2025-12-20',
  '18', '17', '16', '有', '16', '1', '10'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K5718', 'K', '太原', '苏州',
  '08:36', '15:00', '6:24', '2025-12-14',
  '10', '17', '19', '14', '2', '20', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K4752', 'K', '苏州', '太原',
  '21:23', '03:47', '6:24', '2025-12-15',
  '候补', NULL, '候补', '候补', '13', '4', '16'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G7460', 'G', '佛山西', '石家庄',
  '11:32', '21:28', '9:56', '2025-12-20',
  '10', '3', '12', '10', '17', '13', '12'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G5798', 'G', '石家庄', '佛山西',
  '13:49', '23:45', '9:56', '2025-12-21',
  '7', '0', '候补', '有', '15', '15', '11'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z9716', 'Z', '上海', '杭州',
  '07:15', '14:08', '6:53', '2025-12-16',
  '14', '14', '11', '候补', '4', '候补', '13'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z1992', 'Z', '杭州', '上海',
  '18:50', '01:43', '6:53', '2025-12-17',
  '17', '1', '7', '有', '2', '17', '2'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D554', 'D', '佛山', '哈尔滨西',
  '15:11', '16:35', '1:24', '2025-12-15',
  '16', '11', '5', '15', '12', '7', '4'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D1828', 'D', '哈尔滨西', '佛山',
  '14:09', '15:33', '1:24', '2025-12-15',
  NULL, '候补', NULL, '8', '11', '候补', '1'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K1909', 'K', '杭州东', '苏州北',
  '09:17', '18:02', '8:45', '2025-12-18',
  '有', '候补', '7', '9', '8', '7', '1'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K98', 'K', '苏州北', '杭州东',
  '21:07', '05:52', '8:45', '2025-12-18',
  '9', '19', '13', '0', '8', '6', '1'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D2476', 'D', '福州', '北京西',
  '13:37', '16:53', '3:16', '2025-12-15',
  '有', '16', '有', NULL, '候补', '19', '5'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D3285', 'D', '北京西', '福州',
  '20:32', '23:48', '3:16', '2025-12-16',
  '11', '2', '7', '0', NULL, '候补', '12'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G3349', 'G', '乌鲁木齐南', '厦门北',
  '18:14', '23:30', '5:16', '2025-12-26',
  '15', '16', '4', '4', '候补', '20', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G9723', 'G', '厦门北', '乌鲁木齐南',
  '19:05', '00:21', '5:16', '2025-12-28',
  '12', '15', '有', '3', '14', '候补', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D5722', 'D', '广州南', '成都',
  '10:58', '18:27', '7:29', '2025-12-19',
  '17', '11', '有', '20', '3', '13', '3'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D7947', 'D', '成都', '广州南',
  '21:44', '05:13', '7:29', '2025-12-21',
  '19', '12', '14', '5', '11', '有', '6'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G8295', 'G', '兰州西', '合肥南',
  '07:37', '11:07', '3:30', '2025-12-23',
  NULL, '13', '候补', '17', '候补', '20', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G8729', 'G', '合肥南', '兰州西',
  '08:08', '11:38', '3:30', '2025-12-23',
  '13', '候补', '有', '有', '2', '10', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G6505', 'G', '南宁', '天津西',
  '19:33', '04:26', '8:53', '2025-12-18',
  '1', '13', '18', '15', '8', '19', '13'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G800', 'G', '天津西', '南宁',
  '11:16', '20:09', '8:53', '2025-12-18',
  '6', '有', '11', '有', NULL, '候补', '15'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D6045', 'D', '昆明', '太原',
  '20:39', '06:36', '9:57', '2025-12-20',
  '0', '9', '候补', '11', '5', '8', '8'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D9518', 'D', '太原', '昆明',
  '13:52', '23:49', '9:57', '2025-12-22',
  '4', '7', '16', '16', NULL, '候补', '17'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z8811', 'Z', '郑州东', '苏州',
  '20:36', '01:26', '4:50', '2025-12-18',
  '8', '20', '14', '3', '3', NULL, '18'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z4671', 'Z', '苏州', '郑州东',
  '13:29', '18:19', '4:50', '2025-12-18',
  '候补', '2', '有', '19', '8', '15', '6'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D5223', 'D', '乌鲁木齐南', '上海',
  '07:52', '09:17', '1:25', '2025-12-18',
  '4', '19', '10', '17', NULL, '8', '17'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D6925', 'D', '上海', '乌鲁木齐南',
  '12:43', '14:08', '1:25', '2025-12-19',
  '16', '5', '候补', NULL, '13', '有', '3'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D9287', 'D', '昆明南', '汉口',
  '12:17', '21:03', '8:46', '2025-12-25',
  '7', '2', NULL, NULL, '候补', '14', '5'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D5947', 'D', '汉口', '昆明南',
  '18:51', '03:37', '8:46', '2025-12-25',
  '候补', '候补', '17', '5', '有', '6', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K343', 'K', '沈阳', '广州南',
  '08:23', '17:06', '8:43', '2025-12-21',
  '7', '12', '候补', '4', '候补', NULL, NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K2034', 'K', '广州南', '沈阳',
  '21:08', '05:51', '8:43', '2025-12-23',
  '3', '11', '3', '16', '8', '15', '17'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D1551', 'D', '天津西', '哈尔滨',
  '06:44', '15:48', '9:04', '2025-12-23',
  NULL, '17', '15', NULL, '12', '16', '13'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D1144', 'D', '哈尔滨', '天津西',
  '07:13', '16:17', '9:04', '2025-12-23',
  '17', NULL, '候补', '0', '13', '有', '18'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D4626', 'D', '沈阳北', '宁波东',
  '20:40', '22:01', '1:21', '2025-12-14',
  '候补', '6', '12', '1', '候补', '19', '12'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D5701', 'D', '宁波东', '沈阳北',
  '19:36', '20:57', '1:21', '2025-12-15',
  '8', '候补', '8', '17', '5', NULL, '4'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K9757', 'K', '深圳北', '佛山西',
  '06:52', '07:52', '1:00', '2025-12-19',
  '15', '候补', '候补', '有', NULL, NULL, '7'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K9880', 'K', '佛山西', '深圳北',
  '13:06', '14:06', '1:00', '2025-12-19',
  NULL, '11', '15', '候补', '11', '候补', '11'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K7180', 'K', '贵阳北', '合肥南',
  '20:37', '23:09', '2:32', '2025-12-16',
  '7', NULL, '8', '4', '11', '4', '19'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K2221', 'K', '合肥南', '贵阳北',
  '18:49', '21:21', '2:32', '2025-12-18',
  '18', '9', '20', NULL, '有', '7', '13'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G2170', 'G', '太原南', '济南西',
  '06:22', '15:01', '8:39', '2025-12-22',
  '13', NULL, '有', '5', '16', '10', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G1587', 'G', '济南西', '太原南',
  '17:01', '01:40', '8:39', '2025-12-24',
  '0', NULL, '有', '10', '8', '候补', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G7357', 'G', '长春西', '济南',
  '19:46', '21:46', '2:00', '2025-12-24',
  '20', NULL, '5', '17', '2', '17', '4'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G3158', 'G', '济南', '长春西',
  '22:48', '00:48', '2:00', '2025-12-26',
  '14', '15', '候补', '候补', '15', '有', '4'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z438', 'Z', '北京西', '哈尔滨',
  '15:05', '00:51', '9:46', '2025-12-14',
  '10', '15', '有', '17', '候补', '候补', '19'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z9449', 'Z', '哈尔滨', '北京西',
  '09:22', '19:08', '9:46', '2025-12-16',
  NULL, '3', '候补', '15', NULL, '候补', '9'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z6427', 'Z', '乌鲁木齐南', '宁波东',
  '14:02', '19:52', '5:50', '2025-12-26',
  NULL, NULL, '10', '候补', '6', '候补', '5'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z5673', 'Z', '宁波东', '乌鲁木齐南',
  '20:45', '02:35', '5:50', '2025-12-26',
  '0', NULL, '1', NULL, '8', '有', '19'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G676', 'G', '北京西', '上海虹桥',
  '06:32', '13:50', '7:18', '2025-12-17',
  '7', '9', '候补', '6', '4', '20', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G8618', 'G', '上海虹桥', '北京西',
  '06:33', '13:51', '7:18', '2025-12-17',
  '13', '2', '8', '1', '候补', NULL, '5'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z4430', 'Z', '罗湖', '海口',
  '07:11', '16:12', '9:01', '2025-12-25',
  '7', NULL, '15', '10', '1', '7', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z8106', 'Z', '海口', '罗湖',
  '08:46', '17:47', '9:01', '2025-12-25',
  '12', '候补', '19', '4', '7', '1', '15'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z7436', 'Z', '长春', '太原南',
  '16:38', '23:30', '6:52', '2025-12-26',
  '8', '有', '13', '13', '11', '14', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z9194', 'Z', '太原南', '长春',
  '07:13', '14:05', '6:52', '2025-12-26',
  '候补', '15', '候补', '候补', '14', '2', '20'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G6616', 'G', '深圳', '厦门',
  '16:37', '19:31', '2:54', '2025-12-16',
  '有', '2', '4', '有', '16', '13', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G1344', 'G', '厦门', '深圳',
  '10:18', '13:12', '2:54', '2025-12-17',
  '7', '18', '2', '15', '15', '候补', '4'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D4020', 'D', '宁波东', '南京南',
  '13:36', '15:38', '2:02', '2025-12-18',
  '5', '15', '1', '4', NULL, '8', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D4486', 'D', '南京南', '宁波东',
  '21:38', '23:40', '2:02', '2025-12-18',
  '9', NULL, '2', '19', '19', '6', '14'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D4644', 'D', '青岛', '海口',
  '20:28', '02:07', '5:39', '2025-12-20',
  '14', '有', '有', '8', '8', '9', '3'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D926', 'D', '海口', '青岛',
  '08:24', '14:03', '5:39', '2025-12-22',
  '11', '2', '有', '19', '7', '有', '20'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D16', 'D', '广州东', '乌鲁木齐南',
  '19:59', '22:14', '2:15', '2025-12-26',
  '9', '有', NULL, '14', '17', '17', '15'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D2894', 'D', '乌鲁木齐南', '广州东',
  '14:01', '16:16', '2:15', '2025-12-26',
  '3', '17', '有', '15', NULL, '17', '8'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K1412', 'K', '济南西', '太原南',
  '08:01', '12:33', '4:32', '2025-12-27',
  '13', '候补', '候补', NULL, '候补', '候补', '13'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K7464', 'K', '太原南', '济南西',
  '17:25', '21:57', '4:32', '2025-12-28',
  '7', NULL, '有', '有', '16', '0', '7'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z4627', 'Z', '上海', '济南西',
  '08:17', '12:20', '4:03', '2025-12-18',
  '7', '候补', '有', '16', '17', '20', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z7872', 'Z', '济南西', '上海',
  '10:57', '15:00', '4:03', '2025-12-19',
  '6', '有', '11', '候补', '有', '2', '9'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z6322', 'Z', '海口', '哈尔滨西',
  '12:29', '16:25', '3:56', '2025-12-25',
  '有', '19', '13', '15', '20', '6', '19'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z5559', 'Z', '哈尔滨西', '海口',
  '07:23', '11:19', '3:56', '2025-12-27',
  NULL, '2', '17', '0', '18', '1', '14'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G3040', 'G', '广州南', '昆明',
  '12:16', '18:37', '6:21', '2025-12-17',
  '16', '12', '5', '7', '有', NULL, NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G1656', 'G', '昆明', '广州南',
  '20:56', '03:17', '6:21', '2025-12-18',
  '3', '有', '18', '有', NULL, '有', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G9481', 'G', '佛山西', '宁波',
  '13:21', '18:13', '4:52', '2025-12-15',
  NULL, '5', '候补', '16', '1', '11', '7'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G1696', 'G', '宁波', '佛山西',
  '13:22', '18:14', '4:52', '2025-12-17',
  '候补', '16', '1', '15', '7', '5', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z3002', 'Z', '杭州南', '北京',
  '10:10', '16:48', '6:38', '2025-12-19',
  '9', '有', '0', '候补', NULL, '18', '9'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z4630', 'Z', '北京', '杭州南',
  '22:52', '05:30', '6:38', '2025-12-19',
  '8', '12', '候补', '14', NULL, '有', '2'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z4856', 'Z', '兰州西', '沈阳北',
  '10:49', '18:36', '7:47', '2025-12-21',
  '1', '2', '6', '10', '有', '7', '7'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z3892', 'Z', '沈阳北', '兰州西',
  '07:59', '15:46', '7:47', '2025-12-23',
  '1', '18', '1', '14', '0', '0', '7'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D8944', 'D', '西安北', '石家庄北',
  '11:45', '20:48', '9:03', '2025-12-24',
  '1', '6', '7', NULL, '7', '17', '18'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D7674', 'D', '石家庄北', '西安北',
  '19:40', '04:43', '9:03', '2025-12-26',
  '有', '12', '有', '20', '候补', '16', '20'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G8261', 'G', '贵阳', '上海南',
  '21:37', '05:44', '8:07', '2025-12-14',
  '19', '候补', '6', '15', '5', '7', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G3525', 'G', '上海南', '贵阳',
  '08:29', '16:36', '8:07', '2025-12-15',
  '有', NULL, '候补', '16', '3', '有', '15'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G8312', 'G', '青岛北', '乌鲁木齐',
  '10:19', '15:17', '4:58', '2025-12-22',
  '19', '有', '18', '候补', '有', '14', '3'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G5540', 'G', '乌鲁木齐', '青岛北',
  '21:34', '02:32', '4:58', '2025-12-24',
  '5', '19', '候补', '19', '6', '1', '6'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z6785', 'Z', '深圳', '哈尔滨',
  '19:13', '01:23', '6:10', '2025-12-23',
  '候补', '候补', '候补', '14', '4', '17', '15'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z5433', 'Z', '哈尔滨', '深圳',
  '07:47', '13:57', '6:10', '2025-12-23',
  '13', '2', '18', '5', '10', '4', '7'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K4998', 'K', '石家庄', '昆明南',
  '08:45', '15:36', '6:51', '2025-12-27',
  '候补', NULL, '19', '有', '有', NULL, '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K3137', 'K', '昆明南', '石家庄',
  '09:58', '16:49', '6:51', '2025-12-28',
  '19', NULL, '2', '1', '有', NULL, '12'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G324', 'G', '海口', '福州',
  '13:34', '19:21', '5:47', '2025-12-20',
  '16', '有', '10', '19', NULL, '18', '18'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G6585', 'G', '福州', '海口',
  '09:47', '15:34', '5:47', '2025-12-22',
  '14', '9', '11', NULL, '8', '候补', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z6360', 'Z', '西安北', '武汉',
  '19:11', '20:47', '1:36', '2025-12-23',
  '有', '候补', '6', '18', '候补', '0', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z6316', 'Z', '武汉', '西安北',
  '07:19', '08:55', '1:36', '2025-12-24',
  '2', '3', '有', '19', '16', NULL, '4'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G2032', 'G', '大连', '长沙',
  '08:36', '16:50', '8:14', '2025-12-21',
  '18', '有', '候补', NULL, '17', '候补', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G7393', 'G', '长沙', '大连',
  '10:49', '19:03', '8:14', '2025-12-23',
  '有', NULL, '候补', '6', '0', '16', '5'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z3233', 'Z', '沈阳', '广州',
  '09:26', '15:17', '5:51', '2025-12-23',
  '3', '1', '2', '11', '14', '19', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z7563', 'Z', '广州', '沈阳',
  '21:26', '03:17', '5:51', '2025-12-24',
  '候补', '3', '7', '0', '11', '有', '14'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z6038', 'Z', '合肥', '济南西',
  '11:06', '13:46', '2:40', '2025-12-25',
  '有', '候补', '7', '有', '13', '19', '10'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z749', 'Z', '济南西', '合肥',
  '22:04', '00:44', '2:40', '2025-12-25',
  '16', '候补', '10', '有', '15', '11', '6'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z431', 'Z', '长沙', '长春西',
  '13:49', '20:01', '6:12', '2025-12-14',
  '4', '11', NULL, '候补', '12', '11', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z2630', 'Z', '长春西', '长沙',
  '10:51', '17:03', '6:12', '2025-12-14',
  '8', '4', '1', '20', '8', '20', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z2951', 'Z', '昆明南', '福州南',
  '22:11', '23:25', '1:14', '2025-12-14',
  '8', '0', '6', '15', '0', '有', '8'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z45', 'Z', '福州南', '昆明南',
  '18:56', '20:10', '1:14', '2025-12-15',
  '15', '0', NULL, '有', '候补', '有', '4'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D6621', 'D', '兰州', '重庆北',
  '13:55', '18:23', '4:28', '2025-12-22',
  '11', '3', '20', '13', '18', '1', '10'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D5227', 'D', '重庆北', '兰州',
  '10:30', '14:58', '4:28', '2025-12-24',
  '候补', '12', '10', '候补', '有', '10', '10'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z635', 'Z', '苏州北', '沈阳北',
  '08:14', '09:28', '1:14', '2025-12-18',
  '5', '0', '候补', '2', '4', '2', '12'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z5800', 'Z', '沈阳北', '苏州北',
  '08:15', '09:29', '1:14', '2025-12-20',
  '7', '3', '3', '20', '1', '12', '9'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z9917', 'Z', '汉口', '乌鲁木齐南',
  '21:24', '07:01', '9:37', '2025-12-22',
  '16', '2', '5', '6', '有', '13', '11'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z3210', 'Z', '乌鲁木齐南', '汉口',
  '11:07', '20:44', '9:37', '2025-12-22',
  '8', '2', '15', '9', '12', '2', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D280', 'D', '南宁东', '哈尔滨',
  '13:53', '23:34', '9:41', '2025-12-25',
  '3', '20', '15', '8', NULL, '3', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D5523', 'D', '哈尔滨', '南宁东',
  '19:54', '05:35', '9:41', '2025-12-26',
  '20', '10', '2', '13', NULL, NULL, '8'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K8288', 'K', '南京南', '福州南',
  '06:41', '08:37', '1:56', '2025-12-18',
  '5', NULL, '4', '8', NULL, '10', '12'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K8842', 'K', '福州南', '南京南',
  '16:49', '18:45', '1:56', '2025-12-19',
  '16', '11', NULL, '15', '3', '2', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z1877', 'Z', '乌鲁木齐', '福州南',
  '16:19', '19:39', '3:20', '2025-12-24',
  NULL, '15', '2', NULL, '6', '候补', '0'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z3624', 'Z', '福州南', '乌鲁木齐',
  '06:08', '09:28', '3:20', '2025-12-26',
  '有', '18', NULL, '1', '1', '9', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G4921', 'G', '贵阳北', '海口',
  '14:01', '23:40', '9:39', '2025-12-26',
  '19', '1', '7', '19', '4', '11', '7'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G6775', 'G', '海口', '贵阳北',
  '10:36', '20:15', '9:39', '2025-12-26',
  '有', '有', '有', NULL, '6', '候补', '5'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z8641', 'Z', '武昌', '沈阳北',
  '20:49', '22:23', '1:34', '2025-12-26',
  NULL, '0', '5', '9', '有', '13', '20'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z437', 'Z', '沈阳北', '武昌',
  '07:47', '09:21', '1:34', '2025-12-27',
  NULL, '20', '9', '候补', '有', '17', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z5745', 'Z', '沈阳', '长沙',
  '19:03', '22:21', '3:18', '2025-12-22',
  '0', '6', '有', '12', '3', '11', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z1916', 'Z', '长沙', '沈阳',
  '12:37', '15:55', '3:18', '2025-12-23',
  '12', '候补', '7', '9', '4', NULL, '14'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K5988', 'K', '沈阳', '兰州',
  '06:28', '09:37', '3:09', '2025-12-24',
  '候补', '14', NULL, '17', '有', '17', '2'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K2572', 'K', '兰州', '沈阳',
  '20:26', '23:35', '3:09', '2025-12-26',
  '16', '13', '候补', NULL, '16', '16', '3'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K6433', 'K', '福州南', '兰州西',
  '08:57', '18:07', '9:10', '2025-12-24',
  '19', '6', '候补', '有', '2', '18', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K2136', 'K', '兰州西', '福州南',
  '21:48', '06:58', '9:10', '2025-12-24',
  '6', '候补', '有', '7', '4', '5', '19'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z7053', 'Z', '海口', '兰州',
  '13:28', '19:47', '6:19', '2025-12-25',
  NULL, '1', NULL, NULL, '3', '1', '13'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z8530', 'Z', '兰州', '海口',
  '08:14', '14:33', '6:19', '2025-12-25',
  '4', '有', '有', '6', '有', '0', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z1883', 'Z', '海口', '重庆北',
  '14:10', '20:49', '6:39', '2025-12-22',
  '18', '候补', '候补', '2', NULL, '有', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z1409', 'Z', '重庆北', '海口',
  '12:03', '18:42', '6:39', '2025-12-24',
  '20', NULL, '候补', '20', '14', NULL, '14'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K6439', 'K', '广州南', '济南',
  '22:42', '02:54', '4:12', '2025-12-13',
  '9', NULL, '候补', '10', '20', '8', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K6930', 'K', '济南', '广州南',
  '19:00', '23:12', '4:12', '2025-12-15',
  '2', '17', '15', '有', '8', '10', '7'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z7363', 'Z', '青岛', '上海松江',
  '18:45', '00:28', '5:43', '2025-12-20',
  '有', '1', '2', '19', NULL, '14', '4'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z7499', 'Z', '上海松江', '青岛',
  '07:40', '13:23', '5:43', '2025-12-21',
  '0', '17', '候补', '19', '3', NULL, NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G6411', 'G', '厦门', '长沙南',
  '14:00', '17:20', '3:20', '2025-12-19',
  '18', '0', '20', '16', '0', '2', '15'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G3518', 'G', '长沙南', '厦门',
  '15:36', '18:56', '3:20', '2025-12-21',
  '13', '16', '2', '5', NULL, '有', '7'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G4061', 'G', '深圳北', '天津西',
  '20:24', '22:03', '1:39', '2025-12-26',
  '12', '候补', '4', '20', '有', NULL, '9'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G334', 'G', '天津西', '深圳北',
  '13:50', '15:29', '1:39', '2025-12-26',
  '13', NULL, '17', '8', '2', '候补', '11'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G3492', 'G', '杭州南', '苏州北',
  '09:13', '11:38', '2:25', '2025-12-17',
  '19', '15', '5', '2', '19', '有', '12'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G425', 'G', '苏州北', '杭州南',
  '21:48', '00:13', '2:25', '2025-12-17',
  NULL, '20', '17', '有', '候补', '10', '4'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G3995', 'G', '南宁东', '苏州',
  '15:27', '19:23', '3:56', '2025-12-14',
  '1', '5', '18', '候补', '7', NULL, '8'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G7846', 'G', '苏州', '南宁东',
  '20:24', '00:20', '3:56', '2025-12-16',
  '16', '8', '有', '8', '2', '4', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z6468', 'Z', '青岛', '成都东',
  '19:45', '01:06', '5:21', '2025-12-23',
  '11', '12', '候补', '有', NULL, '1', '2'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z7637', 'Z', '成都东', '青岛',
  '07:22', '12:43', '5:21', '2025-12-25',
  '4', '14', '候补', '有', '9', '9', '7'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K1353', 'K', '杭州南', '深圳',
  '13:29', '16:38', '3:09', '2025-12-26',
  '有', '4', '18', '9', '7', '15', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K4808', 'K', '深圳', '杭州南',
  '16:07', '19:16', '3:09', '2025-12-26',
  NULL, '17', '19', '1', '8', '有', '7'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z3885', 'Z', '成都南', '哈尔滨西',
  '10:46', '20:38', '9:52', '2025-12-17',
  '9', '有', '有', '候补', '1', '8', '3'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z9694', 'Z', '哈尔滨西', '成都南',
  '10:03', '19:55', '9:52', '2025-12-18',
  '14', NULL, '18', '有', '有', '候补', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z5893', 'Z', '罗湖', '长沙',
  '17:09', '19:31', '2:22', '2025-12-13',
  '7', '候补', '7', NULL, '20', NULL, '19'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z4628', 'Z', '长沙', '罗湖',
  '15:06', '17:28', '2:22', '2025-12-13',
  '20', '候补', '13', '6', '6', '13', '13'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z599', 'Z', '北京南', '杭州',
  '10:10', '15:16', '5:06', '2025-12-19',
  '候补', '13', '4', '13', '4', '8', '10'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z4668', 'Z', '杭州', '北京南',
  '07:56', '13:02', '5:06', '2025-12-19',
  '候补', '候补', '有', '3', '1', '有', '20'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D4981', 'D', '石家庄', '郑州东',
  '07:15', '12:03', '4:48', '2025-12-25',
  '候补', NULL, '12', '11', '1', '有', '19'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D5138', 'D', '郑州东', '石家庄',
  '13:13', '18:01', '4:48', '2025-12-27',
  '9', '2', '19', '10', '18', '2', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K9328', 'K', '海口', '贵阳北',
  '20:30', '22:08', '1:38', '2025-12-21',
  '18', '有', '14', '0', '9', '9', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K2308', 'K', '贵阳北', '海口',
  '10:03', '11:41', '1:38', '2025-12-22',
  '9', '7', '11', '10', '4', NULL, '18'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K6405', 'K', '长春西', '沈阳',
  '14:06', '19:49', '5:43', '2025-12-27',
  '7', '15', NULL, '8', '16', NULL, '17'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K6502', 'K', '沈阳', '长春西',
  '07:35', '13:18', '5:43', '2025-12-29',
  '7', '有', '有', '有', '有', '11', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D1100', 'D', '济南', '佛山西',
  '14:39', '20:01', '5:22', '2025-12-17',
  '17', '0', NULL, '16', '7', '7', '18'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D6805', 'D', '佛山西', '济南',
  '16:56', '22:18', '5:22', '2025-12-19',
  NULL, '15', '2', NULL, NULL, '20', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K2437', 'K', '海口', '西安北',
  '22:29', '02:36', '4:07', '2025-12-22',
  '7', '3', '13', '1', '18', '18', '12'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K6815', 'K', '西安北', '海口',
  '17:50', '21:57', '4:07', '2025-12-24',
  '1', '0', '14', '6', '18', '10', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K5389', 'K', '武昌', '苏州北',
  '21:47', '01:12', '3:25', '2025-12-14',
  '10', '候补', '候补', '15', NULL, '14', '2'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K3411', 'K', '苏州北', '武昌',
  '20:41', '00:06', '3:25', '2025-12-15',
  '有', '10', '14', '19', NULL, '13', '6'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z3534', 'Z', '杭州', '昆明',
  '12:50', '20:53', '8:03', '2025-12-21',
  '有', '候补', '9', '候补', '6', '1', '3'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z7007', 'Z', '昆明', '杭州',
  '19:23', '03:26', '8:03', '2025-12-23',
  '1', NULL, '1', '0', '0', NULL, '16'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D2710', 'D', '西安北', '杭州',
  '22:55', '04:15', '5:20', '2025-12-17',
  '16', '9', '候补', '5', '19', '有', '2'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D4693', 'D', '杭州', '西安北',
  '21:09', '02:29', '5:20', '2025-12-19',
  '10', '有', '13', '8', '有', '有', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z6630', 'Z', '南京南', '重庆北',
  '22:09', '04:29', '6:20', '2025-12-27',
  NULL, '14', '16', '候补', '有', '8', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z7491', 'Z', '重庆北', '南京南',
  '09:23', '15:43', '6:20', '2025-12-29',
  '12', '3', '有', '0', '13', '4', '19'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z5835', 'Z', '哈尔滨', '石家庄北',
  '14:45', '19:16', '4:31', '2025-12-26',
  '有', '候补', '16', '18', '候补', '1', '12'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z6570', 'Z', '石家庄北', '哈尔滨',
  '19:31', '00:02', '4:31', '2025-12-28',
  '5', '有', '19', '1', '4', '14', '2'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D7274', 'D', '南宁', '汉口',
  '21:02', '23:00', '1:58', '2025-12-19',
  '5', '候补', '有', '11', NULL, '有', '19'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D1421', 'D', '汉口', '南宁',
  '18:25', '20:23', '1:58', '2025-12-20',
  NULL, '候补', '14', '6', '有', '12', '8'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G8610', 'G', '南宁东', '太原南',
  '13:24', '23:07', '9:43', '2025-12-22',
  '16', '12', '18', '20', '13', '20', '15'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G7524', 'G', '太原南', '南宁东',
  '20:37', '06:20', '9:43', '2025-12-22',
  '19', '6', '候补', '20', '8', '1', '13'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K308', 'K', '郑州东', '深圳北',
  '13:59', '20:31', '6:32', '2025-12-23',
  '8', '17', '0', '9', '1', NULL, '13'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K2711', 'K', '深圳北', '郑州东',
  '06:16', '12:48', '6:32', '2025-12-24',
  '10', '11', '有', NULL, '2', '6', '3'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G7845', 'G', '南宁', '重庆北',
  '19:36', '21:05', '1:29', '2025-12-19',
  '有', '18', '17', '13', '19', '候补', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G5805', 'G', '重庆北', '南宁',
  '10:13', '11:42', '1:29', '2025-12-19',
  '12', '7', '15', '候补', NULL, '16', '15'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G409', 'G', '广州东', '合肥南',
  '15:20', '23:05', '7:45', '2025-12-25',
  NULL, '4', '15', '16', '4', NULL, '9'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G3685', 'G', '合肥南', '广州东',
  '22:49', '06:34', '7:45', '2025-12-27',
  '12', '18', '候补', '20', '15', '6', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z4319', 'Z', '佛山西', '杭州南',
  '10:49', '13:36', '2:47', '2025-12-17',
  NULL, '13', '5', '17', '11', '17', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z543', 'Z', '杭州南', '佛山西',
  '15:14', '18:01', '2:47', '2025-12-17',
  '有', '8', '10', '11', '11', '20', '1'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G4625', 'G', '武汉', '长春',
  '20:44', '23:25', '2:41', '2025-12-26',
  NULL, '有', '候补', '候补', '14', '候补', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G4186', 'G', '长春', '武汉',
  '21:57', '00:38', '2:41', '2025-12-27',
  NULL, '3', '9', '14', '6', '3', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K540', 'K', '南宁', '兰州西',
  '16:43', '23:54', '7:11', '2025-12-22',
  '18', '6', '18', '13', '13', '5', '2'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K9998', 'K', '兰州西', '南宁',
  '12:20', '19:31', '7:11', '2025-12-22',
  '12', '5', '候补', '候补', '4', '13', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D2581', 'D', '太原南', '厦门',
  '16:04', '01:29', '9:25', '2025-12-16',
  NULL, '20', '1', '11', '18', '10', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D6394', 'D', '厦门', '太原南',
  '10:13', '19:38', '9:25', '2025-12-18',
  '16', '10', '19', '候补', '候补', '13', '6'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K3494', 'K', '苏州', '上海松江',
  '17:34', '21:33', '3:59', '2025-12-15',
  NULL, '16', '8', '8', '12', '3', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K9998', 'K', '上海松江', '苏州',
  '08:59', '12:58', '3:59', '2025-12-15',
  '候补', NULL, '20', '候补', '候补', '15', '7'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G9659', 'G', '深圳北', '青岛',
  '06:32', '13:16', '6:44', '2025-12-16',
  '7', '有', '2', '8', '有', '候补', '2'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G9896', 'G', '青岛', '深圳北',
  '10:58', '17:42', '6:44', '2025-12-18',
  '7', '7', '13', '有', '16', '有', '4'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D1503', 'D', '汉口', '太原',
  '11:14', '17:02', '5:48', '2025-12-20',
  '3', '候补', '0', '10', NULL, '2', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D8760', 'D', '太原', '汉口',
  '11:33', '17:21', '5:48', '2025-12-22',
  '16', '17', '18', NULL, '4', NULL, '17'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D5622', 'D', '青岛北', '石家庄北',
  '08:11', '17:44', '9:33', '2025-12-25',
  '6', '6', '1', '14', '5', '有', '15'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D7561', 'D', '石家庄北', '青岛北',
  '19:13', '04:46', '9:33', '2025-12-25',
  '16', '有', '15', '20', '有', '2', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D2838', 'D', '海口', '兰州西',
  '12:18', '15:35', '3:17', '2025-12-27',
  '有', NULL, '候补', '9', NULL, '候补', '4'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D3275', 'D', '兰州西', '海口',
  '15:56', '19:13', '3:17', '2025-12-29',
  '候补', '4', '17', '有', '0', '20', '10'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z1109', 'Z', '佛山西', '天津',
  '21:44', '23:05', '1:21', '2025-12-18',
  '7', '候补', '15', '9', NULL, '候补', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z5348', 'Z', '天津', '佛山西',
  '11:43', '13:04', '1:21', '2025-12-20',
  '18', '有', '候补', '候补', '4', '10', '12'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D9306', 'D', '乌鲁木齐', '南宁',
  '15:43', '23:21', '7:38', '2025-12-22',
  '6', '6', '2', NULL, '有', '16', '15'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D319', 'D', '南宁', '乌鲁木齐',
  '20:02', '03:40', '7:38', '2025-12-23',
  '19', '有', '14', '4', '候补', '20', '19'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D892', 'D', '上海', '长沙',
  '07:56', '17:22', '9:26', '2025-12-16',
  '候补', '6', '16', '20', '13', '3', '6'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D4208', 'D', '长沙', '上海',
  '21:31', '06:57', '9:26', '2025-12-17',
  '候补', '有', '4', '5', NULL, '18', '8'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G4755', 'G', '武汉', '上海南',
  '13:47', '21:09', '7:22', '2025-12-27',
  '7', '3', NULL, '7', '11', '11', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G317', 'G', '上海南', '武汉',
  '06:16', '13:38', '7:22', '2025-12-28',
  '7', '候补', '14', '7', '20', '有', '6'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K9431', 'K', '成都', '济南东',
  '16:59', '01:13', '8:14', '2025-12-24',
  '9', '候补', '4', '4', '11', '候补', '0'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K9199', 'K', '济南东', '成都',
  '16:08', '00:22', '8:14', '2025-12-24',
  '14', '5', '候补', '7', '有', NULL, '3'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D5998', 'D', '海口', '合肥',
  '13:55', '23:07', '9:12', '2025-12-16',
  NULL, '10', '2', '2', NULL, '有', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D7935', 'D', '合肥', '海口',
  '19:58', '05:10', '9:12', '2025-12-17',
  '14', '有', '6', '7', '8', '15', '19'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D4618', 'D', '太原南', '郑州东',
  '14:16', '23:48', '9:32', '2025-12-13',
  '10', '8', '13', '17', '有', '有', '14'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D644', 'D', '郑州东', '太原南',
  '08:36', '18:08', '9:32', '2025-12-14',
  '有', '10', '8', '16', '候补', '3', '5'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K2698', 'K', '贵阳北', '罗湖',
  '07:00', '09:43', '2:43', '2025-12-27',
  '20', '6', '有', '14', NULL, '18', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K438', 'K', '罗湖', '贵阳北',
  '18:28', '21:11', '2:43', '2025-12-28',
  '有', '有', '7', '2', '2', '19', '20'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K3333', 'K', '郑州', '长春',
  '06:24', '14:04', '7:40', '2025-12-27',
  '19', '8', '15', '候补', '11', '3', '19'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K3090', 'K', '长春', '郑州',
  '20:33', '04:13', '7:40', '2025-12-29',
  '有', '14', '20', '8', '候补', '有', '19'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G8538', 'G', '南宁', '苏州北',
  '09:20', '10:21', '1:01', '2025-12-20',
  NULL, '8', '1', '11', '17', NULL, '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G6947', 'G', '苏州北', '南宁',
  '19:52', '20:53', '1:01', '2025-12-22',
  '9', '13', '7', '15', '11', '11', '5'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z7527', 'Z', '沈阳北', '成都',
  '21:27', '03:28', '6:01', '2025-12-15',
  NULL, '7', '有', '19', '17', '14', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z183', 'Z', '成都', '沈阳北',
  '18:09', '00:10', '6:01', '2025-12-16',
  '候补', '7', '4', '12', '14', '16', '18'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G2324', 'G', '青岛', '宁波',
  '17:37', '21:27', '3:50', '2025-12-13',
  '9', '7', '12', '19', NULL, '3', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G5585', 'G', '宁波', '青岛',
  '16:43', '20:33', '3:50', '2025-12-13',
  '1', '候补', '5', '16', '有', NULL, '0'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K5893', 'K', '西安北', '罗湖',
  '08:15', '17:44', '9:29', '2025-12-25',
  '20', '19', '1', '6', NULL, '4', '18'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K4283', 'K', '罗湖', '西安北',
  '06:16', '15:45', '9:29', '2025-12-26',
  '0', '11', '有', NULL, NULL, '候补', '20'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D7343', 'D', '成都南', '重庆北',
  '18:36', '21:56', '3:20', '2025-12-19',
  '9', '0', '9', '1', '9', '8', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D5949', 'D', '重庆北', '成都南',
  '14:01', '17:21', '3:20', '2025-12-20',
  '2', '12', '3', '11', '5', '20', '2'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G4874', 'G', '石家庄', '乌鲁木齐南',
  '17:19', '02:52', '9:33', '2025-12-26',
  '0', '9', '8', '20', '4', '2', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G6917', 'G', '乌鲁木齐南', '石家庄',
  '21:46', '07:19', '9:33', '2025-12-28',
  '8', NULL, '候补', '12', '2', '13', '5'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D697', 'D', '石家庄北', '上海虹桥',
  '06:37', '11:05', '4:28', '2025-12-18',
  '18', '6', '12', '有', '13', '20', '9'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D6743', 'D', '上海虹桥', '石家庄北',
  '07:05', '11:33', '4:28', '2025-12-19',
  '4', '候补', '0', '有', '8', '候补', '0'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z7033', 'Z', '石家庄北', '济南东',
  '10:48', '12:40', '1:52', '2025-12-24',
  '11', '19', '有', '12', NULL, '14', '12'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z8116', 'Z', '济南东', '石家庄北',
  '16:35', '18:27', '1:52', '2025-12-26',
  '17', NULL, '18', '16', '有', '14', '4'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D461', 'D', '长沙南', '沈阳北',
  '20:03', '02:08', '6:05', '2025-12-20',
  '20', '0', '7', '5', '14', '有', '17'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D7359', 'D', '沈阳北', '长沙南',
  '09:29', '15:34', '6:05', '2025-12-21',
  NULL, '6', '3', '11', '14', '有', '13'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G5373', 'G', '哈尔滨西', '杭州',
  '06:25', '09:10', '2:45', '2025-12-17',
  NULL, '13', '4', '1', '16', '10', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G4978', 'G', '杭州', '哈尔滨西',
  '15:46', '18:31', '2:45', '2025-12-18',
  '13', '有', '有', '候补', '9', '有', '16'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z9459', 'Z', '福州', '太原',
  '17:40', '19:57', '2:17', '2025-12-21',
  '候补', '有', '候补', '候补', '3', '6', '15'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z1865', 'Z', '太原', '福州',
  '22:54', '01:11', '2:17', '2025-12-21',
  '0', NULL, '12', '0', '16', '4', '15'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z9123', 'Z', '西安', '佛山',
  '12:08', '13:18', '1:10', '2025-12-22',
  '8', '20', NULL, '14', '8', NULL, '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z6111', 'Z', '佛山', '西安',
  '21:46', '22:56', '1:10', '2025-12-23',
  '6', '1', NULL, '17', '20', '候补', '20'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D4448', 'D', '青岛北', '长沙',
  '18:18', '20:16', '1:58', '2025-12-26',
  '11', '20', '18', '候补', '14', '3', '1'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D155', 'D', '长沙', '青岛北',
  '22:42', '00:40', '1:58', '2025-12-28',
  '7', '12', '2', '候补', '1', '有', '2'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z2153', 'Z', '北京丰台', '合肥南',
  '20:50', '23:37', '2:47', '2025-12-21',
  '7', '7', '17', '3', '10', '16', '6'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z2578', 'Z', '合肥南', '北京丰台',
  '13:15', '16:02', '2:47', '2025-12-22',
  '15', '6', '16', '9', '7', '8', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z9562', 'Z', '成都东', '郑州东',
  '13:53', '17:37', '3:44', '2025-12-26',
  '1', '11', '11', '11', '1', '7', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z6143', 'Z', '郑州东', '成都东',
  '21:54', '01:38', '3:44', '2025-12-26',
  '有', '6', '14', '2', '4', '候补', '14'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G3487', 'G', '天津', '成都',
  '16:30', '02:25', '9:55', '2025-12-21',
  NULL, '14', '有', '16', '4', '20', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G4330', 'G', '成都', '天津',
  '12:25', '22:20', '9:55', '2025-12-22',
  '候补', '16', '2', '5', '1', '2', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K3904', 'K', '哈尔滨西', '长沙',
  '08:28', '18:03', '9:35', '2025-12-27',
  '6', '3', '候补', '10', '13', '11', '2'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K4574', 'K', '长沙', '哈尔滨西',
  '14:36', '00:11', '9:35', '2025-12-28',
  '4', '18', '1', '14', '16', '0', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D3090', 'D', '苏州北', '杭州东',
  '12:09', '16:40', '4:31', '2025-12-27',
  '8', '候补', '有', '14', '4', '17', '15'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D5856', 'D', '杭州东', '苏州北',
  '19:49', '00:20', '4:31', '2025-12-27',
  '有', '2', '7', '14', '1', '候补', '4'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K4589', 'K', '乌鲁木齐', '杭州',
  '15:21', '16:25', '1:04', '2025-12-16',
  '11', '15', '候补', '6', '1', '5', '1'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K2570', 'K', '杭州', '乌鲁木齐',
  '21:13', '22:17', '1:04', '2025-12-16',
  '18', '有', NULL, '候补', '有', '有', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K9443', 'K', '乌鲁木齐', '深圳',
  '12:26', '15:48', '3:22', '2025-12-21',
  '20', '17', '8', '20', '12', '14', '6'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K4256', 'K', '深圳', '乌鲁木齐',
  '10:57', '14:19', '3:22', '2025-12-23',
  '7', '14', '10', '19', '16', '18', '20'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K6025', 'K', '海口', '大连',
  '07:12', '10:48', '3:36', '2025-12-16',
  '20', '有', '3', '1', '20', '候补', '20'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K5450', 'K', '大连', '海口',
  '21:00', '00:36', '3:36', '2025-12-18',
  '有', '4', '5', '有', '8', NULL, '0'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z1819', 'Z', '贵阳北', '太原',
  '19:39', '04:24', '8:45', '2025-12-14',
  '1', '8', '有', '10', '4', '4', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z9935', 'Z', '太原', '贵阳北',
  '22:59', '07:44', '8:45', '2025-12-15',
  '2', '5', '1', '11', '18', '2', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z7726', 'Z', '沈阳', '海口',
  '16:10', '01:11', '9:01', '2025-12-17',
  '6', '4', '候补', '候补', '19', '19', '16'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z5693', 'Z', '海口', '沈阳',
  '18:24', '03:25', '9:01', '2025-12-18',
  '19', '6', NULL, '14', '16', '20', '7'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G8376', 'G', '上海南', '贵阳',
  '16:31', '19:51', '3:20', '2025-12-19',
  '10', '18', '有', '10', '候补', '候补', '17'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G338', 'G', '贵阳', '上海南',
  '22:15', '01:35', '3:20', '2025-12-20',
  '1', '候补', '20', '11', '18', '12', '13'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G9904', 'G', '西安', '天津',
  '15:15', '20:02', '4:47', '2025-12-27',
  '2', '1', '12', '10', NULL, '候补', '10'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G4485', 'G', '天津', '西安',
  '17:24', '22:11', '4:47', '2025-12-29',
  '5', '14', '候补', NULL, '11', '11', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G248', 'G', '杭州东', '青岛',
  '10:42', '11:57', '1:15', '2025-12-17',
  '17', '4', '1', '2', '0', '1', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G4011', 'G', '青岛', '杭州东',
  '09:15', '10:30', '1:15', '2025-12-18',
  '候补', '14', '3', '有', NULL, '10', '5'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z4812', 'Z', '乌鲁木齐', '贵阳北',
  '22:20', '02:37', '4:17', '2025-12-27',
  '0', NULL, '15', NULL, '1', '5', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z7403', 'Z', '贵阳北', '乌鲁木齐',
  '14:19', '18:36', '4:17', '2025-12-27',
  '9', '12', '10', '候补', '候补', '11', '7'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D7588', 'D', '沈阳', '南宁东',
  '15:45', '20:48', '5:03', '2025-12-24',
  '15', '候补', NULL, '14', '3', '5', '12'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D7203', 'D', '南宁东', '沈阳',
  '20:57', '02:00', '5:03', '2025-12-25',
  '14', '19', '2', '13', '8', '13', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z8176', 'Z', '沈阳', '杭州',
  '07:51', '09:04', '1:13', '2025-12-25',
  '4', '0', '有', '6', '19', '15', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z1620', 'Z', '杭州', '沈阳',
  '19:50', '21:03', '1:13', '2025-12-27',
  '3', '有', '候补', '5', '2', '14', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z8650', 'Z', '太原', '广州',
  '13:05', '20:44', '7:39', '2025-12-23',
  '6', '有', '20', '18', '18', '19', '17'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z3413', 'Z', '广州', '太原',
  '22:22', '06:01', '7:39', '2025-12-24',
  '18', '11', '10', '12', '6', NULL, '11'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G7611', 'G', '深圳北', '天津西',
  '18:52', '22:27', '3:35', '2025-12-15',
  '19', '5', NULL, '18', '16', '16', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G4208', 'G', '天津西', '深圳北',
  '14:31', '18:06', '3:35', '2025-12-17',
  '1', '5', '9', '有', NULL, '14', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z1185', 'Z', '沈阳北', '北京',
  '10:06', '13:42', '3:36', '2025-12-22',
  NULL, NULL, NULL, '4', '16', '9', '17'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z3065', 'Z', '北京', '沈阳北',
  '07:34', '11:10', '3:36', '2025-12-23',
  '有', NULL, '12', '13', '2', '11', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z6940', 'Z', '哈尔滨西', '苏州北',
  '19:08', '22:46', '3:38', '2025-12-23',
  '候补', '16', '15', NULL, '有', '2', '0'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z4912', 'Z', '苏州北', '哈尔滨西',
  '08:50', '12:28', '3:38', '2025-12-24',
  '有', '7', '9', '候补', '候补', '1', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D5573', 'D', '昆明', '南宁东',
  '08:21', '18:01', '9:40', '2025-12-18',
  '15', '12', NULL, '18', NULL, NULL, NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D3519', 'D', '南宁东', '昆明',
  '20:31', '06:11', '9:40', '2025-12-18',
  '13', '8', '17', '10', '11', '候补', '2'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D2889', 'D', '昆明南', '南宁',
  '20:22', '04:17', '7:55', '2025-12-20',
  '5', '12', '有', '有', '7', '10', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D9480', 'D', '南宁', '昆明南',
  '20:29', '04:24', '7:55', '2025-12-21',
  '5', '1', NULL, '10', '候补', '18', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D6726', 'D', '福州南', '贵阳',
  '19:14', '21:58', '2:44', '2025-12-22',
  '16', '10', '6', '6', '3', '候补', '3'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D1691', 'D', '贵阳', '福州南',
  '10:25', '13:09', '2:44', '2025-12-23',
  '有', '9', '11', '1', '10', '11', '1'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D4510', 'D', '北京', '苏州',
  '09:17', '10:40', '1:23', '2025-12-14',
  '5', '4', '19', '12', '有', '4', '9'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D2687', 'D', '苏州', '北京',
  '18:59', '20:22', '1:23', '2025-12-14',
  '有', '20', '有', '候补', '有', '7', '3'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K5489', 'K', '哈尔滨西', '大连北',
  '08:33', '13:35', '5:02', '2025-12-19',
  '20', '18', '8', '3', '19', NULL, NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K2082', 'K', '大连北', '哈尔滨西',
  '17:43', '22:45', '5:02', '2025-12-19',
  '1', '12', '7', NULL, '13', '10', '10'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G4186', 'G', '哈尔滨西', '长春',
  '14:12', '16:10', '1:58', '2025-12-22',
  '13', '4', '1', NULL, '13', '16', '16'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G8366', 'G', '长春', '哈尔滨西',
  '06:56', '08:54', '1:58', '2025-12-23',
  '13', '19', '10', '13', '7', '6', '19'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K3409', 'K', '太原南', '北京西',
  '08:29', '12:30', '4:01', '2025-12-20',
  '有', '5', NULL, NULL, '20', '候补', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K3870', 'K', '北京西', '太原南',
  '10:45', '14:46', '4:01', '2025-12-21',
  '20', '8', '14', NULL, '有', '有', '19'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D2457', 'D', '厦门北', '郑州东',
  '08:24', '15:22', '6:58', '2025-12-26',
  '有', '16', '6', '9', '6', '12', '5'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D2462', 'D', '郑州东', '厦门北',
  '07:34', '14:32', '6:58', '2025-12-28',
  '10', NULL, '19', '15', '4', '有', '17'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D294', 'D', '天津西', '成都南',
  '12:41', '19:37', '6:56', '2025-12-17',
  '候补', '19', '有', '19', '4', '18', '11'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D2938', 'D', '成都南', '天津西',
  '07:42', '14:38', '6:56', '2025-12-19',
  '16', '1', '19', '10', '3', '有', '9'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D7530', 'D', '广州东', '石家庄北',
  '13:00', '21:06', '8:06', '2025-12-14',
  '8', '1', NULL, '20', '19', '15', '17'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D9266', 'D', '石家庄北', '广州东',
  '10:17', '18:23', '8:06', '2025-12-15',
  '候补', '18', '7', '12', '候补', '13', '15'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z4541', 'Z', '乌鲁木齐', '成都',
  '07:34', '15:32', '7:58', '2025-12-25',
  '5', '7', '2', '2', '6', '候补', '15'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z8763', 'Z', '成都', '乌鲁木齐',
  '16:41', '00:39', '7:58', '2025-12-25',
  '9', '17', '12', '0', '3', '有', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K644', 'K', '兰州西', '宁波',
  '18:11', '00:19', '6:08', '2025-12-27',
  '17', NULL, '9', '8', '6', '18', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K2732', 'K', '宁波', '兰州西',
  '11:42', '17:50', '6:08', '2025-12-28',
  NULL, '有', '16', '2', NULL, '2', '12'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G1558', 'G', '天津西', '杭州南',
  '12:15', '20:47', '8:32', '2025-12-20',
  '有', '12', NULL, '有', '11', '有', '19'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G666', 'G', '杭州南', '天津西',
  '22:05', '06:37', '8:32', '2025-12-20',
  '候补', '7', '7', '14', '2', '1', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D9779', 'D', '佛山', '青岛北',
  '16:23', '22:29', '6:06', '2025-12-17',
  '15', '有', '12', '0', NULL, '0', '18'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D611', 'D', '青岛北', '佛山',
  '10:30', '16:36', '6:06', '2025-12-17',
  '6', '1', '有', NULL, '15', '20', '3'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z6605', 'Z', '重庆北', '天津',
  '22:37', '04:30', '5:53', '2025-12-18',
  '16', NULL, '14', '17', '3', '14', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z3412', 'Z', '天津', '重庆北',
  '14:41', '20:34', '5:53', '2025-12-20',
  '候补', '3', '13', '有', '7', NULL, '17'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K2901', 'K', '厦门北', '兰州',
  '18:15', '23:34', '5:19', '2025-12-19',
  '候补', '候补', '2', NULL, '9', '4', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K119', 'K', '兰州', '厦门北',
  '09:58', '15:17', '5:19', '2025-12-19',
  '18', '有', '候补', '12', '10', '3', '9'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z7126', 'Z', '西安北', '杭州东',
  '18:11', '04:05', '9:54', '2025-12-20',
  '2', '16', '4', NULL, '18', '19', '13'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z7203', 'Z', '杭州东', '西安北',
  '14:03', '23:57', '9:54', '2025-12-22',
  '11', '有', '15', '18', '有', '14', '1'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G65', 'G', '兰州西', '长沙南',
  '10:09', '12:54', '2:45', '2025-12-27',
  '14', NULL, '1', '7', '9', '11', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G2833', 'G', '长沙南', '兰州西',
  '13:50', '16:35', '2:45', '2025-12-29',
  '6', '2', '0', '5', '19', '候补', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z4123', 'Z', '佛山西', '郑州东',
  '12:59', '20:17', '7:18', '2025-12-20',
  '有', '8', '候补', '5', '10', '8', '1'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z1587', 'Z', '郑州东', '佛山西',
  '16:13', '23:31', '7:18', '2025-12-22',
  '1', '15', '候补', '16', '13', '5', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z2869', 'Z', '南京', '长春西',
  '17:16', '00:04', '6:48', '2025-12-26',
  '1', '5', '8', NULL, '6', '18', '10'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z9060', 'Z', '长春西', '南京',
  '20:21', '03:09', '6:48', '2025-12-28',
  '有', '候补', '0', '8', '18', NULL, '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K9223', 'K', '海口', '成都',
  '22:48', '06:43', '7:55', '2025-12-26',
  '19', '8', '10', '9', '候补', '有', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K7406', 'K', '成都', '海口',
  '11:34', '19:29', '7:55', '2025-12-26',
  NULL, '13', '有', '4', '15', '候补', '3'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D955', 'D', '济南东', '重庆西',
  '18:54', '03:36', '8:42', '2025-12-19',
  '8', '9', '3', '14', '候补', '16', '1'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D2742', 'D', '重庆西', '济南东',
  '16:54', '01:36', '8:42', '2025-12-20',
  '11', '候补', '3', '14', '20', '6', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K7142', 'K', '乌鲁木齐', '天津西',
  '10:51', '15:15', '4:24', '2025-12-20',
  '1', '3', '20', '8', '5', '13', '0'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K5910', 'K', '天津西', '乌鲁木齐',
  '12:46', '17:10', '4:24', '2025-12-22',
  '19', '有', '3', '15', '1', '7', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z1967', 'Z', '乌鲁木齐南', '深圳',
  '08:13', '16:52', '8:39', '2025-12-24',
  '候补', '5', '候补', '有', '候补', '10', '18'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z107', 'Z', '深圳', '乌鲁木齐南',
  '15:52', '00:31', '8:39', '2025-12-26',
  '17', '0', '16', '13', '20', '13', '6'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K7205', 'K', '沈阳', '武昌',
  '08:57', '10:10', '1:13', '2025-12-16',
  NULL, '16', '有', '候补', '3', '10', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K5968', 'K', '武昌', '沈阳',
  '07:13', '08:26', '1:13', '2025-12-18',
  '有', '2', '20', '1', '候补', '有', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K9745', 'K', '长春西', '苏州北',
  '06:45', '14:12', '7:27', '2025-12-15',
  '6', '12', '8', '4', '6', '16', '6'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K4710', 'K', '苏州北', '长春西',
  '21:09', '04:36', '7:27', '2025-12-15',
  '10', '20', '有', '7', '9', '有', '9'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K6257', 'K', '宁波', '长春西',
  '17:36', '22:43', '5:07', '2025-12-26',
  '6', '16', '候补', '13', '15', '候补', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K99', 'K', '长春西', '宁波',
  '09:18', '14:25', '5:07', '2025-12-26',
  '17', '14', NULL, '候补', '6', '14', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G5623', 'G', '贵阳北', '北京',
  '13:01', '16:48', '3:47', '2025-12-24',
  '13', '候补', '有', '4', '15', '12', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G8812', 'G', '北京', '贵阳北',
  '20:02', '23:49', '3:47', '2025-12-25',
  '14', '12', '0', '9', '8', '0', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D893', 'D', '贵阳', '天津西',
  '18:37', '22:22', '3:45', '2025-12-27',
  '7', '候补', '16', '10', '1', '16', '4'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D3154', 'D', '天津西', '贵阳',
  '19:50', '23:35', '3:45', '2025-12-29',
  '19', '9', '8', '8', NULL, NULL, '20'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G6662', 'G', '广州', '苏州北',
  '14:39', '21:19', '6:40', '2025-12-26',
  '候补', '候补', '10', NULL, NULL, '10', '7'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G3286', 'G', '苏州北', '广州',
  '18:49', '01:29', '6:40', '2025-12-28',
  '7', '12', '15', '12', '13', NULL, '15'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z9511', 'Z', '西安', '兰州',
  '10:00', '12:34', '2:34', '2025-12-21',
  '20', '有', NULL, '3', '17', '16', '10'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z34', 'Z', '兰州', '西安',
  '15:39', '18:13', '2:34', '2025-12-21',
  '18', '4', '有', '有', '16', '10', '8'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K3858', 'K', '武汉', '兰州',
  '17:00', '20:25', '3:25', '2025-12-24',
  '9', '11', NULL, '13', NULL, '16', '9'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K7615', 'K', '兰州', '武汉',
  '16:17', '19:42', '3:25', '2025-12-24',
  '9', '有', '12', '候补', '候补', '17', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K7616', 'K', '重庆西', '海口',
  '14:48', '20:47', '5:59', '2025-12-16',
  '0', '0', '7', '12', '有', '有', '12'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K7951', 'K', '海口', '重庆西',
  '08:01', '14:00', '5:59', '2025-12-18',
  '4', '14', '14', '14', '有', '有', '2'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D2397', 'D', '长春西', '苏州',
  '21:24', '02:58', '5:34', '2025-12-22',
  '5', '1', '4', '12', '15', '候补', '17'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D5106', 'D', '苏州', '长春西',
  '09:46', '15:20', '5:34', '2025-12-24',
  '8', '16', '8', '18', '候补', '14', '15'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D3750', 'D', '厦门北', '苏州',
  '22:35', '04:48', '6:13', '2025-12-26',
  '8', '候补', '有', '14', '候补', '8', '20'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D4607', 'D', '苏州', '厦门北',
  '11:28', '17:41', '6:13', '2025-12-26',
  '3', '20', '16', '9', '7', '13', '候补'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G5421', 'G', '福州', '贵阳',
  '21:48', '03:10', '5:22', '2025-12-17',
  '0', '1', '20', '1', '候补', '18', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G6292', 'G', '贵阳', '福州',
  '18:41', '00:03', '5:22', '2025-12-17',
  NULL, '18', '7', '13', '20', '13', '9'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D1356', 'D', '重庆西', '沈阳北',
  '16:15', '01:12', '8:57', '2025-12-21',
  '20', NULL, '候补', '有', '2', '9', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D8465', 'D', '沈阳北', '重庆西',
  '09:28', '18:25', '8:57', '2025-12-21',
  '候补', '10', '20', '有', '6', NULL, '17'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G3872', 'G', '贵阳', '西安',
  '18:05', '23:24', '5:19', '2025-12-27',
  '6', '2', '0', '有', '18', '候补', '11'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G3299', 'G', '西安', '贵阳',
  '10:14', '15:33', '5:19', '2025-12-29',
  '13', '18', '13', '10', NULL, '19', '11'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K4637', 'K', '上海', '沈阳北',
  '19:34', '21:48', '2:14', '2025-12-16',
  '4', '17', '16', '6', NULL, '8', '0'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K408', 'K', '沈阳北', '上海',
  '08:06', '10:20', '2:14', '2025-12-16',
  '7', '8', '10', '10', '有', '20', '15'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z1396', 'Z', '海口', '天津西',
  '09:36', '13:59', '4:23', '2025-12-23',
  '候补', '18', '19', '7', '19', '2', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z6778', 'Z', '天津西', '海口',
  '06:42', '11:05', '4:23', '2025-12-25',
  '2', '8', '2', '候补', '16', '8', '11'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K695', 'K', '海口', '济南东',
  '06:41', '10:58', '4:17', '2025-12-20',
  '16', '18', '6', '4', '候补', '候补', '7'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K7387', 'K', '济南东', '海口',
  '16:02', '20:19', '4:17', '2025-12-21',
  '有', NULL, '2', '17', '11', '20', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K9299', 'K', '佛山西', '乌鲁木齐南',
  '16:27', '01:40', '9:13', '2025-12-18',
  '10', '13', '20', '10', '5', '6', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K5321', 'K', '乌鲁木齐南', '佛山西',
  '13:11', '22:24', '9:13', '2025-12-18',
  '0', NULL, '2', '10', '1', '4', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D3425', 'D', '济南西', '昆明',
  '19:40', '01:08', '5:28', '2025-12-27',
  '10', '有', '17', '候补', '候补', '7', '11'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D2694', 'D', '昆明', '济南西',
  '15:59', '21:27', '5:28', '2025-12-29',
  '3', NULL, NULL, '候补', '15', '候补', '19'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D9084', 'D', '济南东', '苏州北',
  '13:23', '14:30', '1:07', '2025-12-19',
  NULL, '候补', '17', '5', '4', '9', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D2758', 'D', '苏州北', '济南东',
  '14:47', '15:54', '1:07', '2025-12-21',
  '0', NULL, '7', '3', '11', '8', '8'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D7370', 'D', '武汉', '厦门北',
  '18:35', '22:09', '3:34', '2025-12-22',
  NULL, '13', '9', '15', '10', '20', '11'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D7744', 'D', '厦门北', '武汉',
  '10:58', '14:32', '3:34', '2025-12-22',
  NULL, '5', '7', '1', '12', '19', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D1329', 'D', '成都东', '大连北',
  '08:02', '14:16', '6:14', '2025-12-20',
  '8', '有', '5', '10', '15', '9', '18'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D6778', 'D', '大连北', '成都东',
  '08:38', '14:52', '6:14', '2025-12-22',
  '0', '候补', '2', '14', '8', '13', '18'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z1642', 'Z', '武汉', '昆明',
  '09:11', '12:06', '2:55', '2025-12-26',
  '19', '8', '候补', '19', '9', '16', '18'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z7118', 'Z', '昆明', '武汉',
  '16:45', '19:40', '2:55', '2025-12-28',
  '1', '14', '17', '11', '4', '6', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G4214', 'G', '太原南', '石家庄北',
  '09:06', '14:31', '5:25', '2025-12-24',
  '18', '2', '6', '2', '11', '候补', '17'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G5569', 'G', '石家庄北', '太原南',
  '19:46', '01:11', '5:25', '2025-12-26',
  '20', '20', NULL, '12', '12', '0', '6'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D7566', 'D', '乌鲁木齐', '沈阳北',
  '18:05', '23:47', '5:42', '2025-12-23',
  NULL, '有', '18', '候补', '13', '候补', '2'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D9076', 'D', '沈阳北', '乌鲁木齐',
  '17:56', '23:38', '5:42', '2025-12-23',
  '5', '有', '9', '4', '2', NULL, '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K6345', 'K', '广州南', '海口',
  '20:46', '23:46', '3:00', '2025-12-27',
  '19', NULL, '6', '1', '候补', '0', '18'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K4110', 'K', '海口', '广州南',
  '09:35', '12:35', '3:00', '2025-12-28',
  '5', '候补', '候补', '候补', '17', '2', '3'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D5404', 'D', '南京南', '太原',
  '07:48', '09:17', '1:29', '2025-12-22',
  '0', '候补', '11', '候补', '15', '8', '5'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'D1373', 'D', '太原', '南京南',
  '09:51', '11:20', '1:29', '2025-12-23',
  '0', '有', '17', '5', '候补', NULL, '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G8544', 'G', '大连北', '石家庄',
  '17:35', '20:41', '3:06', '2025-12-24',
  '13', '18', '3', NULL, '13', '候补', '3'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G4520', 'G', '石家庄', '大连北',
  '06:06', '09:12', '3:06', '2025-12-24',
  '18', '11', '候补', '有', '16', '有', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z1869', 'Z', '贵阳', '兰州西',
  '15:20', '19:50', '4:30', '2025-12-16',
  '5', '17', '12', NULL, '9', '7', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z8736', 'Z', '兰州西', '贵阳',
  '21:10', '01:40', '4:30', '2025-12-16',
  '16', '7', NULL, NULL, '候补', '9', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z5954', 'Z', '深圳北', '海口',
  '13:13', '19:33', '6:20', '2025-12-21',
  '3', '5', '19', '11', '6', '5', '9'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z2854', 'Z', '海口', '深圳北',
  '14:20', '20:40', '6:20', '2025-12-23',
  '18', '2', '16', NULL, NULL, '7', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z9886', 'Z', '贵阳', '北京',
  '06:26', '12:00', '5:34', '2025-12-19',
  NULL, '候补', NULL, NULL, '17', '19', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z2940', 'Z', '北京', '贵阳',
  '11:23', '16:57', '5:34', '2025-12-19',
  '9', '17', '4', '1', '11', '0', '2'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z829', 'Z', '成都东', '兰州',
  '21:46', '02:41', '4:55', '2025-12-14',
  '12', NULL, '17', '15', '16', '16', '2'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z4492', 'Z', '兰州', '成都东',
  '15:13', '20:08', '4:55', '2025-12-14',
  '1', '11', NULL, '11', '有', '10', '5'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z1026', 'Z', '石家庄北', '青岛北',
  '14:55', '20:12', '5:17', '2025-12-22',
  '15', '16', '14', '18', '14', '10', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z8978', 'Z', '青岛北', '石家庄北',
  '16:43', '22:00', '5:17', '2025-12-22',
  '5', '20', '17', '20', '有', '14', '11'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G8658', 'G', '郑州', '合肥南',
  '11:07', '13:56', '2:49', '2025-12-17',
  '2', NULL, '有', '有', '9', '9', '1'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G9819', 'G', '合肥南', '郑州',
  '17:50', '20:39', '2:49', '2025-12-17',
  '20', '有', '有', '2', '有', '14', '8'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G6453', 'G', '沈阳', '佛山西',
  '11:36', '16:51', '5:15', '2025-12-13',
  '16', '2', '1', '6', '候补', '8', '20'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G3835', 'G', '佛山西', '沈阳',
  '19:08', '00:23', '5:15', '2025-12-15',
  '17', '5', '19', '有', '有', '20', '4'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K1900', 'K', '西安北', '佛山',
  '07:00', '12:48', '5:48', '2025-12-27',
  '0', '有', '有', '20', '14', '18', '7'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'K6117', 'K', '佛山', '西安北',
  '21:21', '03:09', '5:48', '2025-12-28',
  '15', '4', '18', '候补', '18', '16', '15'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G2191', 'G', '杭州东', '成都南',
  '12:23', '15:59', '3:36', '2025-12-23',
  '15', '5', NULL, '11', '19', '0', '19'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G4247', 'G', '成都南', '杭州东',
  '15:05', '18:41', '3:36', '2025-12-24',
  NULL, '6', '17', '14', '候补', '20', '6'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z9573', 'Z', '青岛', '哈尔滨',
  '11:03', '12:37', '1:34', '2025-12-18',
  '候补', '6', '12', '6', '14', '7', '5'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z2102', 'Z', '哈尔滨', '青岛',
  '06:46', '08:20', '1:34', '2025-12-18',
  '14', '11', '6', '11', '2', '13', '18'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z6694', 'Z', '杭州南', '长春',
  '19:08', '20:44', '1:36', '2025-12-26',
  '15', '5', '17', '有', '1', '候补', '20'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z4508', 'Z', '长春', '杭州南',
  '20:42', '22:18', '1:36', '2025-12-28',
  '1', '5', '3', '候补', '1', '19', NULL
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G2034', 'G', '南京', '合肥',
  '15:26', '22:08', '6:42', '2025-12-18',
  NULL, '12', '10', '13', '候补', '2', '6'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G7860', 'G', '合肥', '南京',
  '15:50', '22:32', '6:42', '2025-12-19',
  '有', '4', '0', '11', '有', '16', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G3362', 'G', '合肥', '南京',
  '07:28', '14:34', '7:06', '2025-12-15',
  '8', '2', '有', '7', '20', '候补', '2'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'G7037', 'G', '南京', '合肥',
  '12:09', '19:15', '7:06', '2025-12-17',
  '11', '候补', '候补', NULL, '8', '18', '12'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z1295', 'Z', '沈阳北', '太原南',
  '17:07', '20:37', '3:30', '2025-12-20',
  NULL, '0', '7', '候补', NULL, '10', '有'
);

INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  'Z4052', 'Z', '太原南', '沈阳北',
  '08:01', '11:31', '3:30', '2025-12-22',
  '3', '6', '6', '有', '2', '19', '有'
);
