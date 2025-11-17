import React from 'react'
import { Outlet } from 'react-router-dom'
import './styles/layout.css'
import { TopHeaderContent } from './components/TopHeaderContent'
import { MainNavContent } from './components/MainNavContent'

export function RootLayout(){
  return (
    <div>
      <header className="top-header-bar">
        <div className="layout-container">
          <TopHeaderContent />
        </div>
      </header>
      <nav className="main-nav-bar">
        <div className="layout-container">
          <MainNavContent />
        </div>
      </nav>
      <main className="main-content-area">
        <div className="layout-container">
          <Outlet />
        </div>
      </main>
    </div>
  )
}