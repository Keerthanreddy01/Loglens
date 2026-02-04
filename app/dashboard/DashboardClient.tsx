'use client'

import { AppShell } from '@/layouts/app-shell'
import { OverviewContent } from '@/features/dashboard/overview-content'
import { AnalyticsContent } from '@/features/analytics/analytics-content'
import { LiveStreamContent } from '@/features/dashboard/live-stream-content'
import { AlertsContent } from '@/features/dashboard/alerts-content'
import { useLogStore } from '@/lib/store'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'

function MainContent() {
  const { activeTab, getFilteredLogs } = useLogStore()
  const filteredLogs = getFilteredLogs()

  // Initialize keyboard shortcuts
  useKeyboardShortcuts({ filteredLogs })

  switch (activeTab) {
    case 'overview':
      return <OverviewContent />
    case 'analytics':
      return <AnalyticsContent />
    case 'live-logs':
      return <LiveStreamContent />
    case 'alerts':
      return <AlertsContent />
    default:
      return <OverviewContent />
  }
}

import { User } from '@workos-inc/node';

export default function DashboardClient({ user }: { user: User }) {
  return (
    <AppShell user={user}>
      <MainContent />
    </AppShell>
  )
}

