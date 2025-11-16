// TODO: 实现个人中心主页组件
import React from 'react';

interface PersonalCenterHomeProps {
  userInfo?: {
    realName?: string;
    username?: string;
    gender?: 'male' | 'female';
  };
  onNavigateToService?: (service: string) => void;
}

const PersonalCenterHome: React.FC<PersonalCenterHomeProps> = ({
  userInfo,
  onNavigateToService
}) => {
  const realName = userInfo?.realName || '用户';
  const gender = userInfo?.gender || 'male'; // 默认男性

  // 根据时间获取问候语
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      return '上午';
    } else if (hour >= 12 && hour < 18) {
      return '下午';
    } else {
      return '晚上';
    }
  };

  const timeGreeting = getTimeGreeting();
  const genderTitle = gender === 'male' ? '先生' : '女士';
  const welcomeMessage = `${realName} ${genderTitle}，${timeGreeting}好！`;

  return (
    <div style={{ padding: '0', maxWidth: '100%', margin: '0' }}>
      {/* 蓝色横条 */}
      <div style={{ 
        width: '100%', 
        height: '4px', 
        backgroundColor: '#1890ff',
        marginBottom: '20px'
      }} />

      {/* 问候语 */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
          <img
            src="/assets/home-speaker-icon.png"
            alt="小喇叭"
            style={{
              width: '128px',
              height: '112px',
              objectFit: 'contain',
              marginBottom: '-10px'
            }}
          />
          <p style={{ fontSize: '24px', color: '#000', margin: 0, lineHeight: '1.5' }}>
            <span style={{ fontWeight: 'bold' }}>{realName}</span>
            <span style={{ fontSize: '20px', fontWeight: 'normal' }}> {genderTitle}，{timeGreeting}好！</span>
          </p>
        </div>
      </div>

      {/* 浅蓝色提示框 */}
      <div
        style={{
          padding: '20px 25px',
          backgroundColor: 'white',
          border: '1px solid #91d5ff',
          borderRadius: '4px',
          marginBottom: '50px',
          fontSize: '14px',
          lineHeight: '1.8',
          color: '#333'
        }}
      >
        <p style={{ margin: '0 0 10px 0' }}>
          欢迎您登录中国铁路客户服务中心网站。
        </p>
        <p style={{ margin: '0 0 10px 0', color: '#ff4d4f' }}>
          如果您的密码在其他网站也使用，建议您修改本网站密码。
        </p>
        <p style={{ margin: '0 0 10px 0' }}>
          点击
          <span
            onClick={() => onNavigateToService?.('会员服务')}
            style={{
              color: '#1890ff',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            成为会员
          </span>
        </p>
        <p style={{ margin: 0 }}>
          如果您需要预订车票，请您点击
          <span
            onClick={() => onNavigateToService?.('车票服务')}
            style={{
              color: '#1890ff',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            车票预订
          </span>
        </p>
      </div>

      {/* 微信和支付宝二维码 */}
      <div style={{ marginBottom: '40px', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '60px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: '180px',
              height: '180px',
              border: '1px solid #e8e8e8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '15px',
              backgroundColor: '#fff',
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <img
                src="/assets/wechat-qrcode.png"
                alt="微信二维码"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  padding: '10px'
                }}
              />
            </div>
            <p style={{ fontSize: '12px', color: '#666', lineHeight: '1.4', margin: 0, width: '180px', textAlign: 'center' }}>
              使用微信扫一扫，可通过<br />微信公众号接收12306行程通知
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: '180px',
              height: '180px',
              border: '1px solid #e8e8e8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '15px',
              backgroundColor: '#fff',
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <img
                src="/assets/alipay-qrcode.png"
                alt="支付宝二维码"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  padding: '10px'
                }}
              />
            </div>
            <p style={{ fontSize: '12px', color: '#666', lineHeight: '1.4', margin: 0, width: '180px', textAlign: 'center' }}>
              使用支付宝扫一扫，可通过<br />支付宝通知提醒接收12306行程通知
            </p>
          </div>
        </div>
      </div>

      {/* 黄色边框的温馨提示栏 */}
      <div
        style={{
          padding: '12px 20px',
          border: '2px solid #ffd700',
          borderRadius: '6px',
          backgroundColor: '#fffbe6',
          marginTop: '20px'
        }}
      >
        <h4 style={{
          marginTop: 0,
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#000'
        }}>
          温馨提示
        </h4>
        <div style={{ fontSize: '14px', lineHeight: '1.4', color: '#666' }}>
          <p style={{ margin: '4px 0' }}>
            1.消息通知方式进行相关调整，将通过"铁路12306"App客户端为您推送相关消息（需开启通知权限）。您也可以扫描关注"铁路12306"微信公众号或支付宝生活号，选择通过微信或支付宝接收。列车运行调整的通知仍然发送短信通知给您。
          </p>
          <p style={{ margin: '4px 0' }}>
            2.您可通过"账号安全"中的"通知设置"修改您接收信息服务的方式。
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonalCenterHome;
