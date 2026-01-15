import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getOrderDetails } from '../api/orders';

const RefundSuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { refundData, orderInfo: initialOrderInfo } = location.state || {};
  const [orderInfo, setOrderInfo] = useState<any>(initialOrderInfo || {});

  useEffect(() => {
    // If orderInfo is missing or incomplete, fetch it
    if (refundData?.orderId && (!orderInfo?.trainNumber || !orderInfo?.travelDate)) {
      console.log('Fetching missing order details for:', refundData.orderId);
      getOrderDetails(refundData.orderId).then(res => {
        if (res.data) {
          console.log('Fetched full order details:', res.data);
          setOrderInfo(res.data);
        }
      }).catch(err => {
        console.error('Failed to fetch order details:', err);
      });
    }
  }, [refundData?.orderId, orderInfo?.trainNumber, orderInfo?.travelDate]);

  console.log('RefundSuccessPage rendered', { refundData, orderInfo });

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    
    // Try to parse ISO date string (YYYY-MM-DD)
    const isoMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
        return `${isoMatch[1]}年${Number(isoMatch[2])}月${Number(isoMatch[3])}日`;
    }

    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  };

  const formatMoney = (amount: number | undefined) => {
      return amount != null ? Number(amount).toFixed(1) : '0.0';
  };

  const getRefundRate = () => {
      if (refundData?.refundFeeRate) {
          // If backend provides 0.2, we show 20%
          // If backend provides 20, we show 20%
          // Assuming rate like 0.05, 0.1, 0.2
          if (refundData.refundFeeRate < 1) {
              return (refundData.refundFeeRate * 100).toFixed(0);
          }
          return refundData.refundFeeRate;
      }
      // Fallback calculation
      if (refundData?.refundFee && refundData?.originalPrice) {
          const rate = (refundData.refundFee / refundData.originalPrice) * 100;
          return rate.toFixed(0);
      }
      return '0';
  };

  return (
    <div className="refund-success-page" data-testid="refund-success-page">
      
      <div className="refund-form-area" style={{ width: '952px', margin: '10px auto 120px', border: '1px solid #ddd', backgroundColor: '#fff' }}>
        {/* 退票信息区域 */}
        <div className="refund-info-section" style={{ backgroundColor: '#EDFFCC', padding: '30px 40px', borderBottom: '1px solid #ddd' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>
                <span style={{ 
                    display: 'inline-block', 
                    width: '32px', 
                    height: '32px', 
                    lineHeight: '32px', 
                    textAlign: 'center', 
                    borderRadius: '50%', 
                    backgroundColor: '#00BE00', 
                    color: 'white', 
                    marginRight: '10px',
                    fontSize: '20px'
                }}>✓</span>
                操作成功！
            </div>
            
            <div className="refund-details" style={{ fontSize: '14px', lineHeight: '2.5' }}>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ marginRight: '30px' }}>
                        乘车日期：
                        <span style={{ color: '#FF8200', fontSize: '18px', fontWeight: 'bold' }}>
                            {/* Try all possible fields */}
                            {formatDate(
                                orderInfo?.travelDate || 
                                orderInfo?.travel_date || 
                                orderInfo?.date || 
                                orderInfo?.trainDate || 
                                orderInfo?.start_time || 
                                orderInfo?.startTime || 
                                orderInfo?.departureTime ||
                                orderInfo?.trainInfo?.date ||
                                orderInfo?.trainInfo?.travelDate
                            ) || '----年--月--日'}
                        </span>
                    </span>
                    <span style={{ marginRight: '30px' }}>
                        车次：
                        <span style={{ color: '#FF8200', fontSize: '18px', fontWeight: 'bold' }}>
                            {orderInfo?.trainNumber || orderInfo?.train_number || orderInfo?.train_id || '----'}
                        </span>
                    </span>
                    <span>
                        共计退款：
                        <span style={{ color: '#FF8200', fontSize: '18px', fontWeight: 'bold' }}>
                            {formatMoney(refundData?.refundAmount)}
                        </span>
                        元
                    </span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '30px' }}>
                        票款原价：
                        <span style={{ color: '#FF8200', fontSize: '18px', fontWeight: 'bold' }}>
                            {formatMoney(refundData?.originalPrice)}
                        </span>
                        元
                    </span>
                    <span>
                        退票手续费：
                        <span style={{ color: '#FF8200', fontSize: '18px', fontWeight: 'bold' }}>
                            {formatMoney(refundData?.refundFee)}
                        </span>
                        元
                        （按
                        <span style={{ color: '#FF8200', fontSize: '18px', fontWeight: 'bold' }}>
                            {getRefundRate()}%
                        </span>
                        收取退票手续费）
                    </span>
                </div>
            </div>

            {/* 按钮区域 - Moved inside refund-info-section */}
            <div className="button-section" style={{ marginTop: '30px', textAlign: 'center' }}>
                <button 
                    onClick={() => navigate('/tickets')}
                    style={{ 
                        padding: '8px 40px', 
                        marginRight: '20px', 
                        backgroundColor: '#EFEFEF', 
                        color: '#333', 
                        border: '1px solid #ccc', 
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                >
                    继续购票
                </button>
                <button 
                    onClick={() => navigate('/profile')}
                    style={{ 
                        padding: '8px 40px', 
                        backgroundColor: '#FF8200', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                >
                    查询订单详情
                </button>
            </div>
        </div>

        {/* 提示信息区域 */}
        <div className="refund-tips-section" style={{ padding: '30px 40px', color: '#666', fontSize: '12px', lineHeight: '1.8', backgroundColor: '#FFFBE6' }}>

            <div style={{ marginBottom: '10px', fontWeight: 'bold', color: '#FF8200' }}>温馨提示：</div>
            <div>1.使用现金购买或已领取报销凭证的电子票，线上完成退票后，请持相关证件（购票证件、报销凭证）至车站窗口完成退款。</div>
            <div>2.应退款项按银行规定时限退还至购票时所使用的网上支付工具账户，请注意查询，如有疑问请致电12306人工客服查询。</div>
            <div>3.如您需要退票费报销凭证，请凭购票所使用的乘车人有效身份证件原件和订单号码在办理退票之日起30日内到车站退票窗口索取。</div>
            <div>4.消息通知方式进行相关调整，将通过"铁路12306"App客户端为您推送相关消息（需开启接收推送权限）。您也可以关注"铁路12306"微信公众号或支付宝生活号，选择通过微信或支付宝接收。</div>
        </div>
      </div>
    </div>
  );
};

export default RefundSuccessPage;
