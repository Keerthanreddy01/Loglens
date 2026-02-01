'use client'

import { Bell, AlertTriangle, CheckCircle2, Clock, Plus, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Alert {
  id: string
  name: string
  condition: string
  severity: 'critical' | 'warning' | 'info'
  status: 'active' | 'resolved' | 'muted'
  lastTriggered: string
  triggerCount: number
}

const alerts: Alert[] = [
  {
    id: '1',
    name: 'High Error Rate',
    condition: 'Error rate > 1% for 5 minutes',
    severity: 'critical',
    status: 'active',
    lastTriggered: '2 minutes ago',
    triggerCount: 3,
  },
  {
    id: '2',
    name: 'Redis Connection Failures',
    condition: 'Redis timeout errors > 10/min',
    severity: 'critical',
    status: 'active',
    lastTriggered: '8 minutes ago',
    triggerCount: 15,
  },
  {
    id: '3',
    name: 'Slow Database Queries',
    condition: 'P99 latency > 500ms',
    severity: 'warning',
    status: 'resolved',
    lastTriggered: '1 hour ago',
    triggerCount: 7,
  },
  {
    id: '4',
    name: 'Memory Usage Warning',
    condition: 'Memory > 80% for 10 minutes',
    severity: 'warning',
    status: 'muted',
    lastTriggered: '3 hours ago',
    triggerCount: 2,
  },
]

const severityConfig = {
  critical: { color: 'bg-error', textColor: 'text-error', icon: AlertTriangle },
  warning: { color: 'bg-warning', textColor: 'text-warning', icon: AlertTriangle },
  info: { color: 'bg-info', textColor: 'text-info', icon: Bell },
}

const statusConfig = {
  active: { label: 'Active', color: 'bg-error/10 text-error border-error/20' },
  resolved: { label: 'Resolved', color: 'bg-success/10 text-success border-success/20' },
  muted: { label: 'Muted', color: 'bg-muted text-muted-foreground border-border' },
}

function AlertCard({ alert }: { alert: Alert }) {
  const severity = severityConfig[alert.severity]
  const status = statusConfig[alert.status]
  const Icon = severity.icon
  
  return (
    <div className={cn(
      'bg-card border border-border rounded-lg p-5 transition-colors',
      alert.status === 'active' && 'border-l-4 border-l-error'
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={cn('p-2 rounded-lg', alert.status === 'active' ? 'bg-error/10' : 'bg-secondary')}>
            <Icon className={cn('w-5 h-5', alert.status === 'active' ? 'text-error' : 'text-muted-foreground')} />
          </div>
          <div>
            <h3 className="font-medium text-foreground">{alert.name}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{alert.condition}</p>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant="outline" className={status.color}>
                {status.label}
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Last triggered: {alert.lastTriggered}
              </span>
              <span className="text-xs text-muted-foreground">
                {alert.triggerCount} occurrences
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {alert.status === 'active' && (
            <Button variant="outline" size="sm">
              Acknowledge
            </Button>
          )}
          <Button variant="ghost" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export function AlertsContent() {
  const activeAlerts = alerts.filter(a => a.status === 'active')
  const otherAlerts = alerts.filter(a => a.status !== 'active')
  
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Alert Rules</h1>
          <p className="text-sm text-muted-foreground">
            Configure and manage your log alerting rules
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Alert Rule
        </Button>
      </div>
      
      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-error" />
            </span>
            <h2 className="text-sm font-medium text-foreground uppercase tracking-wide">
              Active Alerts ({activeAlerts.length})
            </h2>
          </div>
          <div className="space-y-3">
            {activeAlerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </section>
      )}
      
      {/* Other Alerts */}
      <section>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
          All Rules ({otherAlerts.length})
        </h2>
        <div className="space-y-3">
          {otherAlerts.map(alert => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      </section>
    </div>
  )
}
