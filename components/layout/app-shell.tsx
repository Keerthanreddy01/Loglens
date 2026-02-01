'use client'

import React from "react"

import { TopNav } from './top-nav'
import { SecondaryNav } from './secondary-nav'
import { LeftSidebar } from './left-sidebar'
import { RightPanel } from './right-panel'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <TopNav />
      <SecondaryNav />
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Fixed width, independently scrollable */}
        <LeftSidebar />
        
        {/* Main Content - Flexible, independently scrollable */}
        <main className="flex-1 overflow-hidden flex flex-col">
          {children}
        </main>
        
        {/* Right Panel - Fixed width, independently scrollable, collapsible */}
        <RightPanel />
      </div>
    </div>
  )
}
