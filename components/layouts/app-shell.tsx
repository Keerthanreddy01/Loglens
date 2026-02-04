'use client'

import React from "react"
import { useLogStore } from '@/lib/store'
import { TopNav } from './top-nav'
import { LeftSidebar } from './left-sidebar'
import { RightPanel } from './right-panel'
import { SecondaryNav } from './secondary-nav'
import { CommandMenu } from '@/shared/command-menu'
import { Button } from '@/ui/button'
import { X } from 'lucide-react'
import { motion } from 'motion/react'
import { User } from '@workos-inc/node'
import { useNotifications } from '@/hooks/use-notifications'

interface AppShellProps {
  children: React.ReactNode;
  user?: User;
}

export function AppShell({ children, user }: AppShellProps) {
  useNotifications();
  const { comparisonLogs, clearComparison, parsedLogs, isFocusMode } = useLogStore()
  const mainErrorCount = parsedLogs.filter(l => l.level === 'ERROR').length
  const compareErrorCount = comparisonLogs.filter(l => l.level === 'ERROR').length

  return (
    <div className="h-screen flex flex-col bg-[#050507] overflow-hidden selection:bg-primary/30 relative">
      <div className="noise-overlay" />

      {/* Background Ambient Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/5 blur-[150px] rounded-full" />
      </div>

      {!isFocusMode && <TopNav user={user} />}

      <CommandMenu />

      <div className="flex-1 flex overflow-hidden mt-[88px] relative z-10">
        {/* Comparison Alert - Floating Style */}
        {comparisonLogs.length > 0 && !isFocusMode && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-[#0A0A0F]/80 backdrop-blur-xl border border-primary/20 rounded-2xl flex items-center gap-6 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-primary ai-indicator-pulse" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Comparing: <span className="text-primary">Main</span> vs <span className="text-zinc-400">Layer 2</span>
              </span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex gap-4 text-[11px] font-medium text-zinc-400">
              <span>{mainErrorCount} Errors</span>
              <span>{compareErrorCount} Errors</span>
            </div>
            <Button variant="ghost" size="sm" onClick={clearComparison} className="h-8 rounded-full px-4 text-[10px] font-bold bg-white/5 hover:bg-white/10">
              <X className="w-3.5 h-3.5 mr-2" />
              Reset
            </Button>
          </motion.div>
        )}

        {/* Left Sidebar */}
        {!isFocusMode && <LeftSidebar />}

        {/* Main Content */}
        <main className="flex-1 overflow-hidden flex flex-col relative bg-transparent">
          {!isFocusMode && <SecondaryNav />}
          <div className="flex-1 overflow-hidden flex flex-col pt-20">
            {children}
          </div>
        </main>

        {/* Right Panel */}
        {!isFocusMode && <RightPanel />}
      </div>
    </div>
  )
}
