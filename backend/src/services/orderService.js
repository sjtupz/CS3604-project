// 实现订单服务层
const {
  getOrdersByStatus,
  getOrdersByDateRange,
  updateOrderStatus,
  createRefundRecord,
  getOrderById
} = require('../db/order');

class OrderService {
  // 获取订单列表（支持日期范围和状态筛选）
  async getOrders(userId, queryParams) {
    try {
      const { status, queryType, startDate, endDate, orderNumber, trainNumber, passengerName } = queryParams;
      
      // 如果只指定了状态，使用getOrdersByStatus
      if (status && !startDate && !endDate && !orderNumber && !trainNumber && !passengerName) {
        return await getOrdersByStatus(userId, status);
      }
      
      // 否则使用getOrdersByDateRange
      const queryOptions = {
        status: status || null,
        queryType: queryType || '按订票日期',
        startDate,
        endDate,
        orderNumber,
        trainNumber,
        passengerName
      };
      
      return await getOrdersByDateRange(userId, queryOptions);
    } catch (error) {
      console.error('Error in getOrders:', error);
      throw error;
    }
  }

  // 根据状态获取订单
  async getOrdersByStatus(userId, status) {
    try {
      return await getOrdersByStatus(userId, status);
    } catch (error) {
      console.error('Error in getOrdersByStatus:', error);
      throw error;
    }
  }

  // 根据日期范围和查询条件获取订单
  async getOrdersByDateRange(userId, queryParams) {
    try {
      return await getOrdersByDateRange(userId, queryParams);
    } catch (error) {
      console.error('Error in getOrdersByDateRange:', error);
      throw error;
    }
  }

  // 更新订单状态
  async updateOrderStatus(orderId, newStatus) {
    try {
      return await updateOrderStatus(orderId, newStatus);
    } catch (error) {
      console.error('Error in updateOrderStatus:', error);
      throw error;
    }
  }

  // 处理退票申请
  async processRefund(orderId, refundData = {}) {
    try {
      // 检查订单是否存在且可以退票
      const order = await getOrderById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      if (order.status !== '未出行') {
        throw new Error('Order cannot be refunded');
      }

      // 创建退票记录
      await createRefundRecord(orderId, refundData);

      // 返回退票后的订单信息
      return await getOrderById(orderId);
    } catch (error) {
      console.error('Error in processRefund:', error);
      throw error;
    }
  }

  // 根据订单ID获取订单信息（服务层方法，调用数据库层）
  async getOrderByIdService(orderId) {
    try {
      return await getOrderById(orderId);
    } catch (error) {
      console.error('Error in getOrderByIdService:', error);
      throw error;
    }
  }
}

module.exports = new OrderService();
