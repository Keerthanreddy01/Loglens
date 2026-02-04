'use client'

import { cn } from '@/lib/utils'
import { useLogStore } from '@/store/useLogsStore'
import { Badge } from '@/components/ui/badge'
import { NotificationSettings } from '@/components/shared/notification-settings'
import { motion } from 'motion/react'

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'live-logs', label: 'Intelligence' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'alerts', label: 'Alerts' },
] as const

export function SecondaryNav() {
  const { activeTab, setActiveTab, stats, parsedLogs, alertRules } = useLogStore()
  const activeAlertsCount = alertRules.filter(a => a.status === 'active').length || (stats.errorRate > 5 ? 1 : 0)

  return (
    <div className="flex items-center justify-center w-full absolute top-6 left-0 z-40 pointer-events-none">
      <div className="flex items-center gap-1 px-1.5 py-1.5 bg-[#0A0A0F]/60 backdrop-blur-2xl border border-white/[0.08] rounded-full shadow-2xl pointer-events-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const showBadge = tab.id === 'alerts' && activeAlertsCount > 0
          const showLogCount = tab.id === 'live-logs' && parsedLogs.length > 0

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'relative flex items-center gap-2 px-5 h-9 text-[11px] font-bold uppercase tracking-widest rounded-full transition-all duration-300 group',
                isActive
                  ? 'text-white bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
              )}
            >
              {tab.label}
              {showBadge && (
                <span className="w-1.5 h-1.5 rounded-full bg-destructive ai-indicator-pulse" />
              )}
              {showLogCount && (
                <span className="text-[10px] text-zinc-600 font-mono group-hover:text-zinc-400 transition-colors">
                  {parsedLogs.length > 1000 ? `${(parsedLogs.length / 1000).toFixed(0)}K` : parsedLogs.length}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 border border-white/10 rounded-full pointer-events-none"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
