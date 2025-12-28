import React from 'react';
import './Footer.css';

// Import images
import link05 from '../assets/footer/link05.png';
import link02 from '../assets/footer/link02.png';
import link03 from '../assets/footer/link03.png';
import link04 from '../assets/footer/link04.png';
import zgtlwb from '../assets/footer/zgtlwb.png';
import zgtlwx from '../assets/footer/zgtlwx.png';
import publicImg from '../assets/footer/public.png';
import downloadImg from '../assets/footer/download.png';
import gongan from '../assets/footer/gongan.png';
import footerSlh from '../assets/footer/footer-slh.jpg';

export const Footer: React.FC = () => {
  return (
    <div className="footer" role="contentinfo" data-testid="footer">
      <div className="footer-con wrapper">
        <div className="foot-links" style={{ marginRight: '50px' }}>
          <h2 className="foot-con-tit">友情链接</h2>
          <ul className="foot-links-list" role="menubar">
            <li role="menuitem">
              <a
                data-name="g_href"
                data-href="http://www.china-railway.com.cn/"
                data-redirect="N"
                href="http://www.china-railway.com.cn/"
                target="_blank"
                rel="noopener noreferrer"
                title="中国国家铁路集团有限公司"
              >
                <img src={link05} alt="中国国家铁路集团有限公司" />
              </a>
            </li>
            <li role="menuitem">
              <a
                data-name="g_href"
                data-href="http://www.china-ric.com/"
                data-redirect="N"
                href="http://www.china-ric.com/"
                target="_blank"
                rel="noopener noreferrer"
                title="中国铁路财产保险自保有限公司"
              >
                <img
                  src={link02}
                  alt="中国铁路财产保险自保有限公司"
                />
              </a>
            </li>
            <li role="menuitem">
              <a
                data-name="g_href"
                title="中国铁路95306网"
                data-href="http://www.95306.cn/"
                data-redirect="N"
                href="http://www.95306.cn/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={link03} alt="中国铁路95306网" />
              </a>
            </li>
            <li role="menuitem">
              <a
                data-name="g_href"
                title="中铁快运股份有限公司"
                data-href="http://www.95572.com/"
                data-redirect="N"
                href="http://www.95572.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={link04} alt="中铁快运股份有限公司" />
              </a>
            </li>
          </ul>
        </div>
        <ul className="foot-code">
          <li style={{ width: '140px' }}>
            <h2 className="foot-con-tit">中国铁路官方微信</h2>
            <div className="code-pic">
              <img src={zgtlwb} alt="中国铁路官方微信" />
            </div>
          </li>
          <li style={{ width: '140px' }}>
            <h2 className="foot-con-tit">中国铁路官方微博</h2>
            <div className="code-pic">
              <img src={zgtlwx} alt="中国铁路官方微博" />
            </div>
          </li>
          <li style={{ width: '110px' }}>
            <h2 className="foot-con-tit">12306 公众号</h2>
            <div className="code-pic">
              <img src={publicImg} alt="12306 公众号" />
            </div>
          </li>
          <li style={{ width: '110px' }}>
            <h2 className="foot-con-tit">铁路12306</h2>
            <div className="code-pic">
              <img src={downloadImg} alt="铁路12306" />
              <div className="code-tips">
                官方APP下载，目前铁路未授权其他网站或APP开展类似服务内容，敬请广大用户注意。
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div className="footer-txt" style={{ position: 'relative' }}>
        <p>
          <span className="mr">版权所有©2008-2025</span>
          <span className="mr">中国铁道科学研究院集团有限公司</span>
          <span>技术支持：铁旅科技有限公司</span>
        </p>
        <p>
          <span className="mr">
            <img src={gongan} alt="公安" style={{ width: '13px', verticalAlign: 'middle', marginRight: '5px' }} />
            <a target="_blank" rel="noopener noreferrer" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010802038392" style={{ color: '#c1c1c1' }}>京公网安备 11010802038392号</a>
          </span>
          <span className="mr">|</span>
          <span className="mr">京ICP备05020493号-4</span>
          <span className="mr">|</span>
          <span>ICP证：京B2-20202537</span>
        </p>
        <div style={{ position: 'absolute', top: '17px', left: '50%', marginLeft: '465px' }}>
          <img src={footerSlh} style={{ display: 'block', width: '130px', height: '46px' }} alt="适老化无障碍服务" />
        </div>
      </div>
    </div>
  );
};
