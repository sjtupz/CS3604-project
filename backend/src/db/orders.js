// 数据库操作骨架 - 订单相关

const { query, get, run } = require('./personal_database');
const { v4: uuidv4 } = require('uuid');

/**
 * 在数据库中创建一个新的订单记录
 */
async function dbCreateOrder(orderInfo) {
  const { userId, trainId, totalAmount, status, fromStationId, toStationId, travelDate, passengers } = orderInfo;
  const id = uuidv4();
  const orderNumber = 'ORD' + Date.now() + Math.floor(Math.random() * 1000);
  const expireAt = new Date(Date.now() + 20 * 60 * 1000).toISOString(); // 20分钟后过期

  const sql = `
    INSERT INTO orders (
      id, user_id, order_number, train_number, price, status, 
      train_info, passenger_info, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `;

  // 这里的 train_info 和 passenger_info 在现有表结构中是 TEXT，我们存储 JSON 字符串
  const trainInfo = JSON.stringify({ trainId, fromStationId, toStationId, travelDate });
  const passengerInfo = JSON.stringify(passengers || []);

  await run(sql, [
    id, userId, orderNumber, trainId, totalAmount, status || '待确认',
    trainInfo, passengerInfo
  ]);

  return { id, orderNumber, expireAt };
}

/**
 * 获取订单详细信息
 */
async function dbGetOrderDetails(orderId) {
  const sql = `
    SELECT id, user_id as userId, order_number as orderNumber, train_number as trainNumber, 
           price, status, train_info as trainInfo, passenger_info as passengerInfo, 
           created_at as createdAt
    FROM orders
    WHERE id = ?
  `;
  const order = await get(sql, [orderId]);
  if (order) {
    // 解析 JSON 字段
    try {
      order.trainInfo = JSON.parse(order.trainInfo);
      order.passengerInfo = JSON.parse(order.passengerInfo);
    } catch (e) {
      console.error('Error parsing JSON fields in order:', e);
    }
  }
  return order;
}

/**
 * 更新订单状态
 */
async function dbUpdateOrderStatus(orderId, status) {
  const sql = `
    UPDATE orders 
    SET status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  const result = await run(sql, [status, orderId]);
  return result.changes > 0;
}

/**
 * 锁定席位
 * 注意：train_tickets 表中的席位字段是 TEXT（如 "有"、"无" 或数字）
 * 这里的逻辑需要根据实际存储的值进行扣减
 */
async function dbLockSeats(trainId, date, fromStationId, toStationId, seatType, count) {
  // 映射席位类型到数据库字段
  const seatMap = {
    '商务座': 'swz_num',
    '一等座': 'yd_num',
    '二等座': 'ed_num',
    '高级软卧': 'rw_num',
    '软卧': 'rw_num',
    '硬卧': 'yw_num',
    '硬座': 'yz_num',
    '无座': 'wz_num'
  };

  const field = seatMap[seatType] || 'ed_num';
  
  // 1. 检查是否有票
  const checkSql = `SELECT ${field} FROM train_tickets WHERE train_no = ? AND date = ?`;
  const row = await get(checkSql, [trainId, date]);

  if (!row) return false;

  let currentCount = row[field];
  if (currentCount === '无' || currentCount === '*' || currentCount === '--') return false;
  if (currentCount === '有') {
    // 如果是 "有"，暂时不扣减，直接返回成功（简化逻辑，实际应有具体座位管理）
    return true;
  }

  const numCount = parseInt(currentCount);
  if (isNaN(numCount) || numCount < count) return false;

  // 2. 扣减票数
  const updateSql = `
    UPDATE train_tickets 
    SET ${field} = CAST((CAST(${field} AS INTEGER) - ?) AS TEXT)
    WHERE train_no = ? AND date = ? AND CAST(${field} AS INTEGER) >= ?
  `;
  const result = await run(updateSql, [count, trainId, date, count]);
  
  return result.changes > 0;
}

/**
 * 释放席位
 */
async function dbReleaseSeats(trainId, date, fromStationId, toStationId, seatType, count) {
  const seatMap = {
    '商务座': 'swz_num',
    '一等座': 'yd_num',
    '二等座': 'ed_num',
    '高级软卧': 'rw_num',
    '软卧': 'rw_num',
    '硬卧': 'yw_num',
    '硬座': 'yz_num',
    '无座': 'wz_num'
  };

  const field = seatMap[seatType] || 'ed_num';
  
  // 检查当前值，如果是数字则加回去
  const checkSql = `SELECT ${field} FROM train_tickets WHERE train_no = ? AND date = ?`;
  const row = await get(checkSql, [trainId, date]);
  
  if (!row) return false;
  
  const currentCount = row[field];
  if (!isNaN(parseInt(currentCount))) {
    const updateSql = `
      UPDATE train_tickets 
      SET ${field} = CAST((CAST(${field} AS INTEGER) + ?) AS TEXT)
      WHERE train_no = ? AND date = ?
    `;
    const result = await run(updateSql, [count, trainId, date]);
    return result.changes > 0;
  }
  
  return true; // 如果不是数字（如 "有"），则不需要加回去
}

module.exports = {
  dbCreateOrder,
  dbGetOrderDetails,
  dbUpdateOrderStatus,
  dbLockSeats,
  dbReleaseSeats
};
