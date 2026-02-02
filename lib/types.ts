export type LogLevel = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'TRACE'

export interface ParsedLog {
  id: string
  lineNumber: number
  timestamp: Date
  level: LogLevel
  service: string
  message: string
  rawLine: string
  metadata?: Record<string, string>
  stackTrace?: string[]
  requestId?: string
  isExpanded?: boolean
}

export interface LogFilter {
  search: string
  levels: LogLevel[]
  services: string[]
  timeRange: {
    start: Date | null
    end: Date | null
  }
  useRegex: boolean
  caseSensitive: boolean
}

export interface SavedQuery {
  id: string
  name: string
  filter: LogFilter
  icon?: string
}

export interface AIInsight {
  type: 'error-spike' | 'pattern' | 'recommendation'
  title: string
  description: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  affectedLogs: string[]
  recommendation?: string
}

export interface LogPattern {
  id: string
  pattern: string
  count: number
  percentage: number
  level: LogLevel
  examples: string[]
  /** AI confidence score 0-100 (optional for backward compatibility) */
  confidenceScore?: number
  /** Detected category: database | api | memory | security | network | auth | other */
  category?: string
}

export interface AlertRule {
  id: string
  name: string
  condition: string
  pattern?: string
  severity: 'critical' | 'warning' | 'info'
  enabled: boolean
  status: 'active' | 'resolved' | 'muted'
  triggerCount: number
  lastTriggered: string
  createdAt: string
}

export interface AnalysisSession {
  id: string
  name: string
  createdAt: string
  rawInput: string
  parsedLogs: ParsedLog[]
  filter: LogFilter
  stats: { totalLogs: number; errorCount: number; warnCount: number; errorRate: number; avgResponseTime: number; activeServices: number; services: string[] }
  patterns: LogPattern[]
  insights: AIInsight[]
}

export interface TimelineDataPoint {
  time: string
  timestamp: Date
  total: number
  errors: number
  warnings: number
  info: number
}

export interface ServiceLogVolume {
  service: string
  data: { time: string; count: number }[]
}

export interface TopException {
  type: string
  count: number
  lastSeen: Date
}
