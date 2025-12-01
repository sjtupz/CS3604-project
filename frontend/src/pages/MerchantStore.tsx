import React from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './MerchantStore.module.css';

const MerchantStore: React.FC = () => {
  const { id } = useParams();
  const displayName = id === 'kfc' ? '肯德基（北京南站店）' : id === 'subway' ? '赛百味（北京南站）' : '商家示例';

  return (
    <div className={styles['store-page']} data-testid="merchant-store">
      <div className={styles.header}>
        <div className={styles.logo}>140x60 占位</div>
        <div>
          <div className={styles.title}>{displayName}</div>
          <div className={styles.meta}>评分 5.0 · 021-59097750 · 10:00–20:00</div>
        </div>
        <div className={styles.fees}>
          <div className={styles.badge}>起送费 ¥0</div>
          <div className={styles.badge}>配送费 ¥8</div>
          <div className={styles.badge}>下单截止 11-30 05:20</div>
          <div className={styles.badge}>提单截止 11-30 05:20</div>
        </div>
      </div>

      <div className={styles.tabs}>
        <span className={styles.tab}>所有商品</span>
        <span className={styles.tab}>评价</span>
        <span className={styles.tab}>商家</span>
        <span style={{ marginLeft: 'auto' }}><Link to="/catering">返回餐饮特产</Link></span>
      </div>

      <div className={styles.categories}>
        {['全部','热销','推荐','单人套餐','中餐','汉堡','小吃','甜品','咖啡','饮料'].map((c) => (
          <div key={c} className={styles.cat}>{c}</div>
        ))}
      </div>

      <div className={styles.section}>
        <div className={styles['section-title']}>新品</div>
        <div className={styles.products}>
          {[
            { name: '冰美式蛋挞2件套', price: '¥26.50', size: '180x140' },
            { name: '热拿铁蛋挞2件套', price: '¥26.00', size: '180x140' },
            { name: '热美式蛋挞2件套', price: '¥28.50', size: '180x140' },
            { name: '黄金鸡块(5块)', price: '¥15.00', size: '180x140' },
          ].map((p) => (
            <div key={p.name} className={styles.card}>
              <div className={styles['card-img']}>{p.size} 占位</div>
              <div className={styles['card-body']}>
                <div className={styles['card-name']}>{p.name}</div>
                <div className={styles['card-price']}>{p.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MerchantStore;
