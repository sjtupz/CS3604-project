// TODO: 实现 DB-CalculateRefundFee 接口
// 描述: 根据退票时间与票面价格计算退票手续费及应退金额
// 依赖: DB-GetOrderDetails

/**
 * 计算退票费用
 * @param {number} ticketPrice - 票面原价
 * @param {string} departureDateTime - 发车时间 (ISO string)
 * @param {string} refundRequestedAt - 退票申请时间 (ISO string)
 * @returns {Object} - { fee, feeRate, refundAmount }
 */
const calculateRefundFee = (ticketPrice, departureDateTime, refundRequestedAt) => {
    const departure = new Date(departureDateTime);
    const refund = new Date(refundRequestedAt);
    const diffMs = departure - refund;
    const diffHours = diffMs / (1000 * 60 * 60);

    let feeRate = 0;
    if (diffHours >= 24 * 8) { // 8 days
        feeRate = 0;
    } else if (diffHours >= 48) { // 48 hours to 8 days
        feeRate = 5;
    } else if (diffHours >= 24) { // 24 hours to 48 hours
        feeRate = 10;
    } else { // < 24 hours
        feeRate = 20;
    }

    let fee = ticketPrice * feeRate / 100;

    if (fee > 0) {
        // Rounding logic
        // 尾数以5角为单位，尾数小于2.5角的舍去、2.5角（含）以上且小于7.5角的计为5角、7.5角（含）以上的进为1元。
        // Example: 8.6 -> 0.6. 0.25 <= 0.6 < 0.75 -> 0.5. Result 8.5.
        // Example: 8.2 -> 0.2. < 0.25 -> 0. Result 8.0.
        // Example: 8.8 -> 0.8. >= 0.75 -> 1. Result 9.0.
        
        const integerPart = Math.floor(fee);
        const fractionalPart = fee - integerPart;

        if (fractionalPart < 0.25) {
            fee = integerPart;
        } else if (fractionalPart < 0.75) {
            fee = integerPart + 0.5;
        } else {
            fee = integerPart + 1.0;
        }

        // Minimum fee rule
        if (fee < 2) {
            fee = 2;
        }
    }

    return {
        fee,
        feeRate,
        refundAmount: Number((ticketPrice - fee).toFixed(1))
    };
};

module.exports = {
    calculateRefundFee
};
