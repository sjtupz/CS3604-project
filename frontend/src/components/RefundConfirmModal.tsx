import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRefundPreview, refundOrder, RefundPreviewData } from '../api/orders';
import './RefundConfirmModal.css';

interface RefundConfirmModalProps {
  orderId: string;
  onClose: () => void;
  orderInfo?: unknown;
}

export const RefundConfirmModal: React.FC<RefundConfirmModalProps> = ({ orderId, onClose, orderInfo }) => {
  const navigate = useNavigate();
  const [refundSummary, setRefundSummary] = useState<RefundPreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('RefundConfirmModal mounted with orderId:', orderId);
    const fetchPreview = async () => {
      try {
        console.log('Fetching refund preview...');
        setIsLoading(true);
        const res = await getRefundPreview(orderId);
        console.log('Preview fetched:', res.data);
        setRefundSummary(res.data);
      } catch (err: unknown) {
        console.error('Fetch preview error:', err);
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || '获取退票信息失败');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPreview();
  }, [orderId]);

  const handleConfirm = async () => {
    try {
      const res = await refundOrder(orderId);
      console.log('Refund response:', res);
      
      // 跳转到退票成功页，并传递退票结果
      navigate('/refund-success', { 
          state: { 
              refundData: {
                  ...(refundSummary || {}), // Ensure refundSummary is not null
                  ...(res?.data || {}),      // Safely access res.data
              },
              orderInfo 
          } 
      });
    } catch (err: unknown) {
      console.error('Refund confirm error:', err);
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || '退票失败，请稍后重试');
    }
  };

  if (isLoading) return <div className="refund-modal-overlay"><div className="refund-modal-content" style={{ padding: '20px', textAlign: 'center' }}>加载中...</div></div>;
  if (error) return <div className="refund-modal-overlay"><div className="refund-modal-content" style={{ padding: '20px', textAlign: 'center' }}>错误: {error} <button onClick={onClose} style={{ marginLeft: '10px' }}>关闭</button></div></div>;

  return (
    <div className="refund-modal-overlay">
      <div className="refund-modal-content" data-testid="refund-confirm-modal">
         <div className="refund-modal-header">
             <span>退票申请</span>
             <button className="refund-close-btn" onClick={onClose}>×</button>
         </div>
         
         <div className="refund-info-section">
             <div className="refund-confirm-text" style={{ display: 'flex', alignItems: 'center' }}>
                 <div className="warning-icon-yellow">?</div>
                 <div>
                     <div style={{ fontSize: '20px', marginBottom: '10px' }}>您确认要退票吗？</div>
                     <div style={{ fontWeight: 'normal' }}>如有订餐饮或特产，请按规定到网站自行办理退订。</div>
                 </div>
             </div>
             {refundSummary && (
                 <>
                    <div className="refund-total-amount">
                        共计退款：
                        <span className="orange-text-large">{refundSummary.refundAmount.toFixed(1)}元</span>
                    </div>
                    <div className="refund-details-column">
                        <div className="detail-item">
                            <span>手续费用：</span>
                            <span className="orange-text">{refundSummary.refundFee.toFixed(1)}元</span>
                        </div>
                        <div className="detail-item">
                            <span>车票票价：</span>
                            <span className="orange-text">{refundSummary.originalPrice.toFixed(1)}元</span>
                        </div>
                        <div className="detail-item">
                            <span>应退票款：</span>
                            <span className="orange-text">{refundSummary.refundAmount.toFixed(1)}元</span>
                        </div>
                    </div>
                 </>
             )}
         </div>

         <div className="refund-tip-section">
            <div style={{ marginBottom: '5px', display: 'flex', alignItems: 'center' }}>
                <span style={{ display: 'inline-block', width: '14px', height: '14px', borderRadius: '50%', border: '1px solid #999', color: '#999', textAlign: 'center', lineHeight: '14px', marginRight: '5px', fontSize: '12px' }}>!</span>
                实际核收退票费及应退票款将按最终交易时间计算。
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ display: 'inline-block', width: '14px', height: '14px', borderRadius: '50%', border: '1px solid #999', color: '#999', textAlign: 'center', lineHeight: '14px', marginRight: '5px', fontSize: '12px' }}>!</span>
                如你需要办理该次列车前续、后续退票业务，请于退票车次票面开车时间前办理。
            </div>
         </div>

         <div className="refund-button-section">
             <button className="refund-btn-cancel" onClick={onClose}>取消</button>
             <button className="refund-btn-confirm" onClick={handleConfirm}>确定</button>
         </div>

         <div className="refund-rules-section">
            1.使用现金购买或已领取报销凭证的电子票，线上完成退票后，请持相关证件（购票证件、报销凭证）至车站窗口完成退款。如您同时购买了"乘意险"，可在车站窗口退款时一并办理。<br/>
            2.退票费按如下规则核收：票面乘车站开车时间前8天（含）以上不收取退票费，48小时以上的按票价5%计，24小时以上、不足48小时的按票价10%计，不足24小时的按票价20%计。上述计算的尾数以5角为单位，尾数小于2.5角的舍去、2.5角（含）以上且小于7.5角的计为5角、7.5角（含）以上的进为1元。退票费最低按2元计收。更多退票规则请查看《退改说明》。<br/>
            3.应退款项按银行规定时限退还至购票时所使用的网上支付工具账户，请注意查询，如有疑问请致电12306人工客服查询。<br/>
            4.跨境旅客旅行须知详见铁路跨境旅客相关运输组织规则和车站公告。
         </div>
      </div>
    </div>
  );
};
