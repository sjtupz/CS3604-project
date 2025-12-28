// 订单服务层骨架

const dbOrders = require('../db/orders');

/**
 * 创建订单
 */
async function createOrder(userId, orderData) {
  const { trainId, fromStationId, toStationId, date, passengers, trainInfo } = orderData;
  
  // 1. 校验乘客信息
  if (!passengers || passengers.length === 0) {
    const error = new Error('请选择乘车人！');
    error.code = 40005;
    throw error;
  }

  // 2. 统计各席别需要的座位数并尝试锁定
  const seatCounts = {};
  passengers.forEach(p => {
    seatCounts[p.seatType] = (seatCounts[p.seatType] || 0) + 1;
  });

  for (const [seatType, count] of Object.entries(seatCounts)) {
    const locked = await dbOrders.dbLockSeats(trainId, date, fromStationId, toStationId, seatType, count);
    if (!locked) {
      const error = new Error(`该车次${seatType}车票已售罄！`);
      error.code = 40902;
      throw error;
    }
  }

  // 3. 计算总金额 (这里简化，实际应根据车次和席别查询价格)
  // 假设从 orderData 中传来了价格信息，或者在这里查询
  const totalAmount = passengers.reduce((sum, p) => sum + (p.price || 0), 0);

  // 4. 创建订单记录
  const orderInfo = {
    userId,
    trainId,
    fromStationId,
    toStationId,
    travelDate: date,
    passengers,
    totalAmount,
    status: '待确认',
    trainInfo: trainInfo
  };

  const result = await dbOrders.dbCreateOrder(orderInfo);
  return result;
}

/**
 * 获取订单详情
 */
async function getOrderDetails(orderId) {
  const order = await dbOrders.dbGetOrderDetails(orderId);
  if (!order) {
    const error = new Error('订单不存在');
    error.code = 404;
    throw error;
  }
  return order;
}

/**
 * 确认订单
 */
async function confirmOrder(orderId) {
  const order = await dbOrders.dbGetOrderDetails(orderId);
  if (!order) {
    throw new Error('订单不存在');
  }
  
  if (order.status !== '待确认') {
    throw new Error('订单状态不正确，无法确认');
  }

  const success = await dbOrders.dbUpdateOrderStatus(orderId, '待支付');
  return success;
}

/**
 * 取消订单
 */
async function cancelOrder(orderId) {
  const order = await dbOrders.dbGetOrderDetails(orderId);
  if (!order) {
    throw new Error('订单不存在');
  }

  // 只有待确认和待支付状态可以取消
  if (order.status !== '待确认' && order.status !== '待支付') {
    throw new Error('当前订单状态无法取消');
  }

  // 1. 更新状态
  const success = await dbOrders.dbUpdateOrderStatus(orderId, '已取消');
  
  if (success) {
    // 2. 释放席位
    const { trainNumber, trainInfo, passengerInfo } = order;
    const { fromStationId, toStationId, travelDate } = trainInfo;
    
    const seatCounts = {};
    passengerInfo.forEach(p => {
      seatCounts[p.seatType] = (seatCounts[p.seatType] || 0) + 1;
    });

    for (const [seatType, count] of Object.entries(seatCounts)) {
      await dbOrders.dbReleaseSeats(trainNumber, travelDate, fromStationId, toStationId, seatType, count);
    }
  }

  return success;
}

/**
 * 查询订单列表
 */
async function listOrders(userId, statusType, searchQuery) {
  let statusList = [];
  let externalStatus = null;

  if (statusType !== undefined && statusType !== null && statusType !== '') {
    const typeNum = parseInt(statusType);
    if (!Number.isNaN(typeNum)) {
      if (typeNum === 0) {
        statusList = ['未支付', '待确认', '待支付'];
      } else if (typeNum === 1) {
        statusList = ['已支付', '未出行'];
      } else if (typeNum === 2) {
        statusList = ['已完成', '已退票', '已取消', '历史订单'];
      }
    } else {
      if (statusType === '待支付') {
        statusList = ['未支付', '待支付'];
        externalStatus = '待支付';
      } else if (statusType === '已支付') {
        statusList = ['已支付'];
      } else {
        statusList = [statusType];
      }
    }
  }

  const orders = await dbOrders.dbGetOrdersByUser(userId, statusList, searchQuery);
  if (externalStatus === '待支付') {
    orders.forEach(o => {
      if (o.status === '未支付') o.status = '待支付';
    });
  }
  return orders;
}

module.exports = {
  createOrder,
  getOrderDetails,
  confirmOrder,
  cancelOrder,
  listOrders,
  getOrderStatus: async (orderId) => {
    const order = await dbOrders.dbGetOrderDetails(orderId);
    if (!order) {
      const err = new Error('订单不存在');
      err.code = 404;
      throw err;
    }
    return order.status === '未支付' ? '待支付' : order.status;
  },
  payOrder: async (orderId) => {
    const ok = await dbOrders.dbUpdateOrderStatus(orderId, '已支付');
    if (!ok) {
      const err = new Error('订单不存在或无法更新');
      err.code = 400;
      throw err;
    }
    return { success: true, status: '已支付' };
  }
};
