'use client'

import { cn } from '@/lib/utils'
import { useLogStore } from '@/lib/store'

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'live-logs', label: 'Live Logs' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'alerts', label: 'Alerts' },
] as const

export function SecondaryNav() {
  const { activeTab, setActiveTab } = useLogStore()
  
  return (
    <div className="h-12 border-b border-border bg-background flex items-center px-4 gap-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            'text-sm font-medium pb-3 pt-3 border-b-2 transition-colors -mb-[1px]',
            activeTab === tab.id
              ? 'text-foreground border-primary'
              : 'text-muted-foreground border-transparent hover:text-foreground'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
