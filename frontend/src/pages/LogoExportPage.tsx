import React, { useRef } from 'react'

const svgMarkup = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="351" height="116" viewBox="0 0 351 116" shape-rendering="geometricPrecision" text-rendering="optimizeLegibility">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FF6F21"/>
      <stop offset="1" stop-color="#FF6700"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="351" height="116" fill="transparent"/>
  <g transform="translate(16,18)">
    <circle cx="30" cy="40" r="30" fill="url(#g)"/>
    <circle cx="30" cy="40" r="20" fill="#fff"/>
    <path d="M30 22c9 0 16 7 16 16 0 6-3 11-7 14v12h-18V52c-4-3-7-8-7-14 0-9 7-16 16-16z" fill="url(#g)"/>
    <rect x="23" y="54" width="14" height="10" rx="2" fill="#fff"/>
    <rect x="20" y="64" width="20" height="6" rx="3" fill="url(#g)"/>
  </g>
  <text x="84" y="52" font-family="Microsoft YaHei, PingFang SC, Noto Sans SC, Arial, sans-serif" font-size="26" fill="#333333">中国铁路<tspan font-weight="600">12306</tspan></text>
  <text x="84" y="82" font-family="Arial, Helvetica, sans-serif" font-size="15" letter-spacing="2" fill="#9B9B9B">12306 CHINA RAILWAY</text>
</svg>`

export default function LogoExportPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const exportPNG = async (scale: number, filename: string) => {
    const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const img = new Image()
    await new Promise<void>((resolve) => {
      img.onload = () => resolve()
      img.src = url
    })
    const baseW = 351
    const baseH = 116
    const w = Math.round(baseW * scale)
    const h = Math.round(baseH * scale)
    const canvas = canvasRef.current!
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, w, h)
    ctx.drawImage(img, 0, 0, w, h)
    const pngUrl = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = pngUrl
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ maxWidth: 800, margin: '20px auto', padding: 20 }}>
      <h2>12306 Logo 导出</h2>
      <div dangerouslySetInnerHTML={{ __html: svgMarkup }} />
      <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
        <button onClick={() => exportPNG(1, 'logo-12306@1x.png')}>导出 PNG @1x</button>
        <button onClick={() => exportPNG(2, 'logo-12306@2x.png')}>导出 PNG @2x</button>
        <button onClick={() => exportPNG(0.5, 'logo-12306@0_5x.png')}>导出 PNG @0.5x</button>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}
