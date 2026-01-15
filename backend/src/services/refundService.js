const { calculateRefundFee } = require('../db/refund');
const { dbGetOrderDetails, dbUpdateOrderStatus, dbReleaseSeats } = require('../db/orders');

/**
 * 获取退票预览信息
 * @param {string} orderId 
 * @param {string} userId 
 */
const getRefundPreview = async (orderId, userId) => {
    // 1. 获取订单详情
    const order = await dbGetOrderDetails(orderId);
    if (!order) {
        const error = new Error('订单不存在');
        error.code = 40403;
        throw error;
    }

    // 2. 校验权限
    if (order.userId !== userId) {
        const error = new Error('无权操作此订单');
        error.code = 40100; // Use appropriate code, maybe 403 or 404 to hide existence
        throw error;
    }

    // 3. 校验状态 (已支付)
    if (order.status !== '已支付') {
        const error = new Error('当前订单不支持退票或已过退票时间');
        error.code = 40006;
        if (order.status === '已退票') {
            error.message = '订单已退票或正在退票处理中';
            error.code = 40903;
        }
        throw error;
    }

    // 4. 校验时间 (未发车)
    // 兼容多种时间格式：ISO string, YYYY-MM-DD HH:mm:ss, HH:mm
    let departureTimeStr = order.departureTime || order.trainInfo?.departureTime;
    const travelDate = order.trainInfo?.travelDate || order.travelDate; // YYYY-MM-DD

    if (!departureTimeStr) {
        // 如果没有具体时间，尝试构造
        // 假设 trainInfo 中可能有 startTime/departureTime
        departureTimeStr = order.trainInfo?.startTime || order.trainInfo?.departureTime || '00:00';
    }

    let departureTime;
    // 如果只有时间 HH:mm 且有日期 YYYY-MM-DD
    if (departureTimeStr.match(/^\d{2}:\d{2}$/) && travelDate) {
        departureTime = new Date(`${travelDate}T${departureTimeStr}:00`);
    } else if (departureTimeStr.match(/^\d{2}:\d{2}:\d{2}$/) && travelDate) {
        departureTime = new Date(`${travelDate}T${departureTimeStr}`);
    } else {
        // 尝试直接解析
        departureTime = new Date(departureTimeStr);
    }

    if (isNaN(departureTime.getTime())) {
        console.error('Invalid departure time:', { departureTimeStr, travelDate, orderId });
        const error = new Error('无法解析发车时间，请联系客服');
        error.code = 500;
        throw error;
    }

    const now = new Date();
    if (now >= departureTime) {
        const error = new Error('当前订单不支持退票或已过退票时间');
        error.code = 40006;
        throw error;
    }

    // 5. 计算退款金额
    // Use price from order (totalAmount)
    const result = calculateRefundFee(order.price, departureTime.toISOString(), now.toISOString());

    return {
        orderId: order.id,
        orderNo: order.orderNumber,
        originalPrice: order.price,
        refundFee: result.fee,
        refundFeeRate: result.feeRate,
        refundAmount: result.refundAmount
    };
};

/**
 * 执行退票
 * @param {string} orderId 
 * @param {string} userId 
 */
const processRefund = async (orderId, userId) => {
    // 1. 获取预览信息 (Includes validation)
    // We can reuse getRefundPreview logic or duplicate it to avoid extra DB call if we want transaction safety
    // For now, let's duplicate essential checks or call getRefundPreview but we need order object for seat release.
    
    const order = await dbGetOrderDetails(orderId);
    if (!order) {
        const error = new Error('订单不存在');
        error.code = 40403;
        throw error;
    }

    if (order.userId !== userId) {
        const error = new Error('无权操作此订单');
        error.code = 40100;
        throw error;
    }

    if (order.status !== '已支付') {
        const error = new Error('当前订单不支持退票或已过退票时间');
        error.code = 40006;
        if (order.status === '已退票') {
            error.message = '订单已退票或正在退票处理中';
            error.code = 40903;
        }
        throw error;
    }

    const travelDate = order.trainInfo?.travelDate || order.travelDate;
    
    // 复用上面的时间解析逻辑
    let departureTimeStr = order.departureTime || order.trainInfo?.departureTime;
    if (!departureTimeStr) {
        departureTimeStr = order.trainInfo?.startTime || order.trainInfo?.departureTime || '00:00';
    }

    let departureTime;
    if (departureTimeStr.match(/^\d{2}:\d{2}$/) && travelDate) {
        departureTime = new Date(`${travelDate}T${departureTimeStr}:00`);
    } else if (departureTimeStr.match(/^\d{2}:\d{2}:\d{2}$/) && travelDate) {
        departureTime = new Date(`${travelDate}T${departureTimeStr}`);
    } else {
        departureTime = new Date(departureTimeStr);
    }
    
    if (isNaN(departureTime.getTime())) {
         // Should not happen if passed getRefundPreview logic, but safe to check
         const error = new Error('无法解析发车时间');
         error.code = 500;
         throw error;
    }

    const now = new Date();
    if (now >= departureTime) {
        const error = new Error('当前订单不支持退票或已过退票时间');
        error.code = 40006;
        throw error;
    }

    // 2. 计算费用
    const calcResult = calculateRefundFee(order.price, departureTime.toISOString(), now.toISOString());

    // 3. 更新订单状态
    const updateSuccess = await dbUpdateOrderStatus(order.id, '已退票', {
        refundFee: calcResult.fee,
        refundAmount: calcResult.refundAmount,
        refundRate: calcResult.feeRate,
        refundDate: true
    });

    if (!updateSuccess) {
        const error = new Error('退票失败，请稍后重试');
        error.code = 50011;
        throw error;
    }

    // 4. 释放席位
    // Iterate passengers to release seats
    if (order.passengerInfo && Array.isArray(order.passengerInfo)) {
        // Group by seatType to minimize DB calls? Or just loop.
        // dbReleaseSeats(trainId, date, fromStationId, toStationId, seatType, count)
        const trainId = order.trainNumber; // Note: dbLockSeats uses trainId as trainNumber? Check dbLockSeats impl.
        // In orders.js: `WHERE train_no = ?` -> trainNumber.
        const date = order.trainInfo?.travelDate || order.travelDate; // Get date from trainInfo if available
        const fromStationId = order.trainInfo?.fromStationId;
        const toStationId = order.trainInfo?.toStationId;

        // Group by seat type
        const seatCounts = {};
        order.passengerInfo.forEach(p => {
            const type = p.seatType;
            seatCounts[type] = (seatCounts[type] || 0) + 1;
        });

        for (const [seatType, count] of Object.entries(seatCounts)) {
            await dbReleaseSeats(trainId, date, fromStationId, toStationId, seatType, count);
        }
    }

    return {
        orderId: order.id,
        travelDate: order.trainInfo?.travelDate || order.travelDate,
        trainNumber: order.trainNumber,
        originalPrice: order.price,
        refundFee: calcResult.fee,
        refundFeeRate: calcResult.feeRate,
        refundAmount: calcResult.refundAmount
    };
};

module.exports = {
    getRefundPreview,
    processRefund
};
