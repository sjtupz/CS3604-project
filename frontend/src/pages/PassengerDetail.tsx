import React from 'react'

function maskId(v: string) {
  if (!v || v.length < 8) return v
  const head = v.slice(0, 4)
  const tail = v.slice(-3)
  return head + '*'.repeat(Math.max(1, v.length - 7)) + tail
}

function maskPhone(v: string) {
  if (!v || v.length < 11) return v
  return v.slice(0, 3) + '****' + v.slice(-4)
}

export default function PassengerDetail() {
  const idNumber = '123456789012345678'
  const phone = '13800138000'

  return (
    <div>
      <h2>基本信息</h2>
      <div data-testid="masked-id">{maskId(idNumber)}</div>
      <h2>联系方式（请提供乘车人真实有效的联系方式）</h2>
      <label htmlFor="country">国家/地区</label>
      <select id="country">
        <option value="+86">+86</option>
        <option value="+852">+852</option>
        <option value="+853">+853</option>
        <option value="+886">+886</option>
      </select>
      <div data-testid="masked-phone">{maskPhone(phone)}</div>
      <h2>附加信息</h2>
    </div>
  )
}