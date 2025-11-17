import React from 'react'

export const MainNavContent: React.FC = () => {
  return (
    <div style={{ display:'flex', gap:28, color:'#fff', height:53, alignItems:'center' }}>
      <span>首页</span>
      <span>车票</span>
      <span>团体服务</span>
      <span>会员服务</span>
      <span>站车服务</span>
      <span>商旅服务</span>
      <span>出行指南</span>
      <span>信息查询</span>
    </div>
  )
}