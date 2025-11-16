// 实现订单数据库操作
const { query, get, run } = require('./database');

// 根据状态获取订单
const getOrdersByStatus = async (userId, status) => {
  try {
    let sql = `
      SELECT 
        id as orderId,
        order_number as orderNumber,
        train_number as trainNumber,
        passenger_name as passengerName,
        booking_date as bookingDate,
        travel_date as travelDate,
        train_info as trainInfo,
        passenger_info as passengerInfo,
        seat_info as seatInfo,
        price,
        status
      FROM orders
      WHERE user_id = ? AND status = ?
    `;
    
    const params = [userId, status];
    
    // 未出行订单和历史订单只返回最近30天的订单
    if (status === '未出行' || status === '历史' || status === '已退票') {
      sql += ` AND created_at >= datetime('now', '-30 days')`;
    }
    
    sql += ` ORDER BY created_at DESC`;
    
    const result = await query(sql, params);
    return result || [];
  } catch (error) {
    console.error('Error in getOrdersByStatus:', error);
    throw error;
  }
};

// 根据日期范围和查询条件获取订单
const getOrdersByDateRange = async (userId, queryParams) => {
  try {
    const { 
      status, 
      queryType, 
      startDate, 
      endDate, 
      orderNumber, 
      trainNumber, 
      passengerName 
    } = queryParams;
    
    let sql = `
      SELECT 
        id as orderId,
        order_number as orderNumber,
        train_number as trainNumber,
        passenger_name as passengerName,
        booking_date as bookingDate,
        travel_date as travelDate,
        train_info as trainInfo,
        passenger_info as passengerInfo,
        seat_info as seatInfo,
        price,
        status
      FROM orders
      WHERE user_id = ?
    `;
    
    const params = [userId];
    
    // 状态筛选
    if (status) {
      sql += ` AND status = ?`;
      params.push(status);
    }
    
    // 日期范围筛选
    if (startDate && endDate) {
      const dateField = queryType === '按乘车日期' ? 'travel_date' : 'booking_date';
      sql += ` AND ${dateField} >= ? AND ${dateField} <= ?`;
      params.push(startDate, endDate);
    }
    
    // 订单号筛选
    if (orderNumber) {
      sql += ` AND order_number LIKE ?`;
      params.push(`%${orderNumber}%`);
    }
    
    // 车次筛选
    if (trainNumber) {
      sql += ` AND train_number LIKE ?`;
      params.push(`%${trainNumber}%`);
    }
    
    // 姓名筛选
    if (passengerName) {
      sql += ` AND passenger_name LIKE ?`;
      params.push(`%${passengerName}%`);
    }
    
    // 未出行订单和历史订单只返回最近30天的订单
    if (status === '未出行' || status === '历史' || status === '已退票') {
      sql += ` AND created_at >= datetime('now', '-30 days')`;
    }
    
    sql += ` ORDER BY created_at DESC`;
    
    const result = await query(sql, params);
    return result || [];
  } catch (error) {
    console.error('Error in getOrdersByDateRange:', error);
    throw error;
  }
};

// 更新订单状态
const updateOrderStatus = async (orderId, newStatus) => {
  try {
    // 检查订单是否存在
    const order = await get('SELECT id, status FROM orders WHERE id = ?', [orderId]);
    if (!order) {
      throw new Error('Order not found');
    }
    
    // 验证状态转换合法性
    const validTransitions = {
      '未完成': ['未出行'],
      '未出行': ['已退票', '历史'],
      '已退票': ['历史']
    };
    
    const currentStatus = order.status;
    if (validTransitions[currentStatus] && !validTransitions[currentStatus].includes(newStatus)) {
      throw new Error(`Invalid status transition from ${currentStatus} to ${newStatus}`);
    }
    
    const sql = `
      UPDATE orders 
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    const result = await run(sql, [newStatus, orderId]);
    return result.changes > 0;
  } catch (error) {
    console.error('Error in updateOrderStatus:', error);
    throw error;
  }
};

// 创建退票记录
const createRefundRecord = async (orderId, refundData = {}) => {
  try {
    const { refundFee = 0 } = refundData;
    
    // 检查订单是否存在
    const order = await get('SELECT id, status FROM orders WHERE id = ?', [orderId]);
    if (!order) {
      throw new Error('Order not found');
    }
    
    // 更新订单状态为已退票，并记录退票信息
    const sql = `
      UPDATE orders 
      SET status = '已退票',
          refund_fee = ?,
          refund_date = CURRENT_DATE,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    const result = await run(sql, [refundFee, orderId]);
    return result.changes > 0;
  } catch (error) {
    console.error('Error in createRefundRecord:', error);
    throw error;
  }
};

// 根据订单ID获取订单信息
const getOrderById = async (orderId) => {
  try {
    const sql = `
      SELECT 
        id as orderId,
        user_id as userId,
        order_number as orderNumber,
        train_number as trainNumber,
        passenger_name as passengerName,
        booking_date as bookingDate,
        travel_date as travelDate,
        train_info as trainInfo,
        passenger_info as passengerInfo,
        seat_info as seatInfo,
        price,
        status,
        refund_fee as refundFee,
        refund_date as refundDate
      FROM orders
      WHERE id = ?
    `;
    
    const result = await get(sql, [orderId]);
    return result;
  } catch (error) {
    console.error('Error in getOrderById:', error);
    throw error;
  }
};

module.exports = {
  getOrdersByStatus,
  getOrdersByDateRange,
  updateOrderStatus,
  createRefundRecord,
  getOrderById
};
