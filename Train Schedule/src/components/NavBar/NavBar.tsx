import React from 'react';
import styles from './NavBar.module.css';
import { Link } from 'react-router-dom';

export const NavBar: React.FC = () => {
  return (
    <header>
      <div className={styles.top}>
        <div className={styles.logo}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M12 2l7 7-7 13-7-13 7-7z" fill="#FF6700" />
          </svg>
          中国铁路12306
        </div>
        <nav>
          <Link className={styles.link} to="/login">登录</Link>
          <span style={{ margin: '0 8px', color: '#9aa3af' }}>|</span>
          <Link className={styles.link} to="/register">注册</Link>
        </nav>
      </div>
      <div className={styles.nav}>
        <div className={styles.navInner}>
          <Link className={styles.link} to="/tickets">车票</Link>
          <Link className={styles.link} to="/orders">订单</Link>
        </div>
      </div>
    </header>
  );
};