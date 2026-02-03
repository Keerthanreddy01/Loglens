'use client'

import { useState } from 'react'
import { Bell, AlertTriangle, CheckCircle2, Clock, Plus, Settings, X, VolumeX, Volume2, Trash2, Sparkles } from 'lucide-react'
import { Button } from '@/ui/button'
import { Badge } from '@/ui/badge'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'
import { Switch } from '@/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/select'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useLogStore } from '@/lib/store'
import type { AlertRule } from '@/lib/types'

const severityConfig = {
  critical: { color: 'bg-destructive', textColor: 'text-destructive', icon: AlertTriangle },
  warning: { color: 'bg-warning', textColor: 'text-warning', icon: AlertTriangle },
  info: { color: 'bg-info', textColor: 'text-info', icon: Bell },
}

const statusConfig = {
  active: { label: 'Active', color: 'bg-destructive/10 text-destructive border-destructive/20' },
  resolved: { label: 'Resolved', color: 'bg-success/10 text-success border-success/20' },
  muted: { label: 'Muted', color: 'bg-muted text-muted-foreground border-border' },
}

function AlertCard({
  alert,
  onAcknowledge,
  onMute,
  onDelete,
  onToggle,
  onEdit,
}: {
  alert: AlertRule
  onAcknowledge: () => void
  onMute: () => void
  onDelete: () => void
  onToggle: () => void
  onEdit: () => void
}) {
  const severity = severityConfig[alert.severity]
  const status = statusConfig[alert.status]
  const Icon = severity.icon

  return (
    <div
      className={cn(
        'rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm p-5 transition-all duration-200 hover:border-border interactive-element',
        alert.status === 'active' && 'border-l-4 border-l-destructive',
        !alert.enabled && 'opacity-60'
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className={cn(
              'p-2 rounded-lg shrink-0',
              alert.status === 'active' ? 'bg-destructive/10' : 'bg-secondary'
            )}
          >
            <Icon
              className={cn(
                'w-5 h-5',
                alert.status === 'active' ? 'text-destructive' : 'text-muted-foreground'
              )}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-foreground truncate">{alert.name}</h3>
              <Switch checked={alert.enabled} onCheckedChange={onToggle} className="scale-75" />
            </div>
            <p className="text-sm text-muted-foreground">{alert.condition}</p>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <Badge variant="outline" className={cn('text-xs', status.color)}>
                {status.label}
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Last: {alert.lastTriggered}
              </span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {alert.triggerCount} occurrences
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {alert.status === 'active' && (
            <Button
              variant="outline"
              size="sm"
              onClick={onAcknowledge}
              className="text-xs h-8 bg-transparent interactive-element"
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              Ack
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 interactive-element"
            onClick={onMute}
            title={alert.status === 'muted' ? 'Unmute' : 'Mute'}
            aria-label={alert.status === 'muted' ? 'Unmute alert' : 'Mute alert'}
          >
            {alert.status === 'muted' ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 interactive-element"
            onClick={onEdit}
            aria-label="Edit alert rule"
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive interactive-element"
            onClick={onDelete}
            aria-label="Delete alert rule"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export function AlertsContent() {
  const {
    alertRules,
    addAlertRule,
    updateAlertRule,
    removeAlertRule,
    patterns,
    setActiveTab,
    createAlertFromPattern,
  } = useLogStore()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingAlert, setEditingAlert] = useState<AlertRule | null>(null)
  const [newAlert, setNewAlert] = useState({
    name: '',
    condition: '',
    severity: 'warning' as 'critical' | 'warning' | 'info',
  })

  const activeAlerts = alertRules.filter((a) => a.status === 'active')
  const otherAlerts = alertRules.filter((a) => a.status !== 'active')

  const handleAcknowledge = (id: string) => {
    updateAlertRule(id, { status: 'resolved' })
    toast.success('Alert acknowledged')
  }

  const handleMute = (id: string) => {
    const alert = alertRules.find((a) => a.id === id)
    updateAlertRule(id, {
      status: alert?.status === 'muted' ? 'resolved' : 'muted',
    })
    toast.success(alert?.status === 'muted' ? 'Alert unmuted' : 'Alert muted')
  }

  const handleDelete = (id: string) => {
    removeAlertRule(id)
    toast.success('Alert rule deleted')
  }

  const handleToggle = (id: string) => {
    const alert = alertRules.find((a) => a.id === id)
    updateAlertRule(id, { enabled: !alert?.enabled })
    toast.success(alert?.enabled ? 'Alert disabled' : 'Alert enabled')
  }

  const handleCreate = () => {
    if (!newAlert.name || !newAlert.condition) {
      toast.error('Please fill in all fields')
      return
    }
    addAlertRule({
      name: newAlert.name,
      condition: newAlert.condition,
      severity: newAlert.severity,
      enabled: true,
    })
    setNewAlert({ name: '', condition: '', severity: 'warning' })
    setIsCreateOpen(false)
    toast.success('Alert rule created')
  }

  const handleEdit = (alert: AlertRule) => setEditingAlert(alert)

  const handleSaveEdit = () => {
    if (!editingAlert) return
    updateAlertRule(editingAlert.id, {
      name: editingAlert.name,
      condition: editingAlert.condition,
      severity: editingAlert.severity,
    })
    setEditingAlert(null)
    toast.success('Alert rule updated')
  }

  const handleCreateFromPattern = (patternId: string) => {
    const pattern = patterns.find((p) => p.id === patternId)
    if (pattern) {
      createAlertFromPattern(pattern)
      toast.success('Alert created from pattern')
      setIsCreateOpen(false)
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-border shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Alert Rules</h1>
            <p className="text-sm text-muted-foreground">
              Configure and manage your log alerting rules
            </p>
          </div>
          <Button className="gap-2 interactive-element" onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-4 h-4" />
            Create Alert Rule
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
        {activeAlerts.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive" />
              </span>
              <h2 className="text-sm font-medium text-foreground uppercase tracking-wide">
                Active Alerts ({activeAlerts.length})
              </h2>
            </div>
            <div className="space-y-3">
              {activeAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onAcknowledge={() => handleAcknowledge(alert.id)}
                  onMute={() => handleMute(alert.id)}
                  onDelete={() => handleDelete(alert.id)}
                  onToggle={() => handleToggle(alert.id)}
                  onEdit={() => handleEdit(alert)}
                />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
            All Rules ({otherAlerts.length})
          </h2>
          {alertRules.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground rounded-xl border border-dashed border-border bg-card/30">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No alert rules configured</p>
              <Button variant="link" onClick={() => setIsCreateOpen(true)} className="mt-2">
                Create your first alert
              </Button>
              {patterns.length > 0 && (
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm mb-3">Or create from detected patterns:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {patterns.slice(0, 3).map((p) => (
                      <Button
                        key={p.id}
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => handleCreateFromPattern(p.id)}
                      >
                        <Sparkles className="w-3 h-3" />
                        {p.pattern.substring(0, 30)}... ({p.count})
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {otherAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onAcknowledge={() => handleAcknowledge(alert.id)}
                  onMute={() => handleMute(alert.id)}
                  onDelete={() => handleDelete(alert.id)}
                  onToggle={() => handleToggle(alert.id)}
                  onEdit={() => handleEdit(alert)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg bg-card/95 backdrop-blur-xl border-border">
          <DialogHeader>
            <DialogTitle>Create Alert Rule</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {patterns.length > 0 && (
              <div className="rounded-lg border border-border bg-secondary/30 p-3">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Create from AI-detected pattern
                </p>
                <div className="flex flex-wrap gap-2">
                  {patterns.slice(0, 5).map((p) => (
                    <Button
                      key={p.id}
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => handleCreateFromPattern(p.id)}
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      {p.pattern.substring(0, 25)}... ({p.count}×)
                    </Button>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Alert Name</Label>
              <Input
                id="name"
                placeholder="e.g., High Error Rate"
                value={newAlert.name}
                onChange={(e) => setNewAlert((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Input
                id="condition"
                placeholder="e.g., Error rate > 1% for 5 minutes"
                value={newAlert.condition}
                onChange={(e) =>
                  setNewAlert((prev) => ({ ...prev, condition: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="severity">Severity</Label>
              <Select
                value={newAlert.severity}
                onValueChange={(value: 'critical' | 'warning' | 'info') =>
                  setNewAlert((prev) => ({ ...prev, severity: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create Alert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingAlert} onOpenChange={() => setEditingAlert(null)}>
        <DialogContent className="max-w-lg bg-card/95 backdrop-blur-xl border-border">
          <DialogHeader>
            <DialogTitle>Edit Alert Rule</DialogTitle>
          </DialogHeader>
          {editingAlert && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Alert Name</Label>
                <Input
                  id="edit-name"
                  value={editingAlert.name}
                  onChange={(e) =>
                    setEditingAlert((prev) =>
                      prev ? { ...prev, name: e.target.value } : null
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-condition">Condition</Label>
                <Input
                  id="edit-condition"
                  value={editingAlert.condition}
                  onChange={(e) =>
                    setEditingAlert((prev) =>
                      prev ? { ...prev, condition: e.target.value } : null
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-severity">Severity</Label>
                <Select
                  value={editingAlert.severity}
                  onValueChange={(value: 'critical' | 'warning' | 'info') =>
                    setEditingAlert((prev) =>
                      prev ? { ...prev, severity: value } : null
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingAlert(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

