// TODO: 实现订单标签页组件
import React, { useState, useEffect } from 'react';

interface OrderTabsProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const OrderTabs: React.FC<OrderTabsProps> = ({
  activeTab = '未完成订单',
  onTabChange
}) => {
  const [currentTab, setCurrentTab] = useState<string>(activeTab);

  useEffect(() => {
    if (activeTab) {
      setCurrentTab(activeTab);
    }
  }, [activeTab]);

  const handleTabClick = (tab: string) => {
    setCurrentTab(tab);
    onTabChange?.(tab);
  };

  const tabs = ['未完成订单', '未出行订单', '历史订单'];

  return (
    <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #ccc' }}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => handleTabClick(tab)}
          style={{
            padding: '10px 20px',
            border: '1px solid #e8e8e8',
            background: 'transparent',
            cursor: 'pointer',
            borderBottom: currentTab === tab ? '2px solid blue' : '2px solid transparent',
            color: currentTab === tab ? 'blue' : 'black',
            fontWeight: currentTab === tab ? 'bold' : 'normal'
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default OrderTabs;
