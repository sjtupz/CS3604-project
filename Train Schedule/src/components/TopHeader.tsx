import React from 'react'
import styles from './Header/Header.module.css'

export const TopHeader: React.FC = () => {
  return (
    <div className={styles.top}>
      <div className={styles.brand} aria-label="中国铁路12306">
        <svg className={styles.brandIconBig} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <circle cx="12" cy="12" r="10" fill="#ff6700" />
          <path d="M12 6l4 4-4 4-4-4 4-4z" fill="#fff" />
        </svg>
        <div className={styles.brandText}>
          <span className={styles.brandCnText}>中国铁路12306</span>
          <span className={styles.brandEnText}>12306 CHINA RAILWAY</span>
        </div>
      </div>
      <div className={styles.search}>
        <input placeholder="搜索 站点 / 车次" aria-label="站点车次搜索" />
      </div>
      <div className={styles.topRight} aria-label="顶栏链接">
        <span>无障碍</span>
        <span>|</span>
        <span>English</span>
        <span>|</span>
        <span>我的12306</span>
        <span>|</span>
        <span>您好</span>
        <span>|</span>
        <span>退出</span>
      </div>
    </div>
  )
}