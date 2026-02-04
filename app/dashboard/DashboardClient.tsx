'use client'

import { AppShell } from '@/components/layouts/app-shell'
import { OverviewContent } from '@/components/logs/overview-content'
import { AnalyticsContent } from '@/components/charts/analytics-content'
import { LiveStreamContent } from '@/components/logs/live-stream-content'
import { AlertsContent } from '@/components/logs/alerts-content'
import { useLogStore } from '@/store/useLogsStore'
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

