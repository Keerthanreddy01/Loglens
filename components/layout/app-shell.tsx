'use client'

import React from "react"
import { useLogStore } from '@/lib/store'
import { TopNav } from './top-nav'
import { SecondaryNav } from './secondary-nav'
import { LeftSidebar } from './left-sidebar'
import { RightPanel } from './right-panel'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const { comparisonLogs, clearComparison, parsedLogs, stats } = useLogStore()
  const mainErrorCount = parsedLogs.filter(l => l.level === 'ERROR').length
  const compareErrorCount = comparisonLogs.filter(l => l.level === 'ERROR').length

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <TopNav />
      {comparisonLogs.length > 0 && (
        <div className="shrink-0 px-4 py-2 bg-primary/10 border-b border-primary/20 flex items-center justify-between">
          <span className="text-sm">
            <strong>Comparing:</strong> Main ({parsedLogs.length} logs, {mainErrorCount} errors) vs File 2 ({comparisonLogs.length} logs, {compareErrorCount} errors)
          </span>
          <Button variant="ghost" size="sm" onClick={clearComparison} className="h-7">
            <X className="w-4 h-4 mr-1" />
            Clear comparison
          </Button>
        </div>
      )}
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
