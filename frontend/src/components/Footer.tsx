import React from 'react'
import './Footer.css'

export const Footer: React.FC = () => {
  return (
    <footer className="footer-container" data-testid="footer">
      <div className="footer-top">
        <div className="footer-content">
          <div className="friend-links">
            <h3 className="section-title">友情链接</h3>
            <ul className="link-grid">
              <li className="link-item" aria-label="中国国家铁路集团有限公司">
                <img className="placeholder-logo" src="https://www.12306.cn/index/images/link01.png" referrerPolicy="no-referrer" alt="中国国家铁路集团有限公司" />
              </li>
              <li className="link-item" aria-label="中国铁路财产保险自保有限公司">
                <img className="placeholder-logo" src="https://www.12306.cn/index/images/link02.png" referrerPolicy="no-referrer" alt="中国铁路财产保险自保有限公司" />
              </li>
              <li className="link-item" aria-label="中国铁路95306网">
                <img className="placeholder-logo" src="https://www.12306.cn/index/images/link03.png" referrerPolicy="no-referrer" alt="中国铁路95306网" />
              </li>
              <li className="link-item" aria-label="中铁快运 CRE">
                <img className="placeholder-logo" src="https://www.12306.cn/index/images/link04.png" referrerPolicy="no-referrer" alt="中铁快运 CRE" />
              </li>
            </ul>
          </div>
          <div className="qr-codes" aria-label="中国铁路官方媒体矩阵">
            <div className="qr-item">
              <img className="placeholder-qr" src="/assets/train_schedule/qr_wx.png" referrerPolicy="no-referrer" alt="中国铁路官方微信二维码" />
              <p className="qr-caption">中国铁路官方微信</p>
            </div>
            <div className="qr-item">
              <img className="placeholder-qr" src="/assets/train_schedule/qr_weibo.png" referrerPolicy="no-referrer" alt="中国铁路官方微博二维码" />
              <p className="qr-caption">中国铁路官方微博</p>
            </div>
            <div className="qr-item">
              <img className="placeholder-qr" src="/assets/train_schedule/qr_public.png" referrerPolicy="no-referrer" alt="12306 公众号二维码" />
              <p className="qr-caption">12306 公众号</p>
            </div>
            <div className="qr-item">
              <img className="placeholder-qr" src="/assets/train_schedule/qr_app.png" referrerPolicy="no-referrer" alt="铁路12306 APP 二维码" />
              <p className="qr-caption">铁路12306</p>
            </div>
          </div>
          <div className="app-tip" aria-label="官方APP下载提示">
            <p className="app-tip-text">官方APP下载，目前铁路未授权其他网站或APP开展类似服务内容，敬请广大用户注意。</p>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-content bottom-content">
          <p className="copyright">版权所有©2008-2025 中国铁道科学研究院集团有限公司 技术支持：铁旅科技有限公司</p>
          <p className="licenses">京公网安备 11010802038392号 | 京ICP备05020493号-4 | ICP证：京B2-20202537</p>
          <button className="accessible-button" aria-label="适老化无障碍服务">适老化无障碍服务</button>
        </div>
      </div>
    </footer>
  )
}
