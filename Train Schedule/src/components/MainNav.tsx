import React from 'react'
import styles from './Header/Header.module.css'

export const MainNav: React.FC = () => {
  return (
    <div style={{ display:'flex', gap:28 }}>
      <span className={styles.navItem}>首页</span>
      <span className={styles.navItem}>车票</span>
      <span className={styles.navItem}>团体服务</span>
      <span className={styles.navItem}>会员服务</span>
      <span className={styles.navItem}>站车服务</span>
      <span className={styles.navItem}>商旅服务</span>
      <span className={styles.navItem}>出行指南</span>
      <span className={styles.navItem}>信息查询</span>
    </div>
  )
}