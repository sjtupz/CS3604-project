import React from 'react'

export const TopHeaderContent: React.FC = () => {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', height:64, color:'#fff' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <circle cx="12" cy="12" r="10" fill="#ff6700" />
          <path d="M12 6l4 4-4 4-4-4 4-4z" fill="#fff" />
        </svg>
        <div style={{ display:'flex', flexDirection:'column', lineHeight:1 }}>
          <span style={{ fontWeight:700 }}>中国铁路12306</span>
          <span style={{ fontSize:12, opacity:.85 }}>12306 CHINA RAILWAY</span>
        </div>
      </div>
      <div style={{ flex:1, display:'flex', justifyContent:'center' }}>
        <input placeholder="搜索 站点 / 车次" aria-label="站点车次搜索" style={{ width:432, height:36, border:'1px solid #e5eaf1', borderRadius:8, padding:'0 12px', background:'#fff' }} />
      </div>
      <div style={{ display:'flex', gap:10, color:'#d1d5db', fontSize:12 }} aria-label="顶栏链接">
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