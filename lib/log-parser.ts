import type { ParsedLog, LogLevel, AIInsight, LogPattern, TimelineDataPoint } from './types'

// Timestamp patterns
const TIMESTAMP_PATTERNS = [
  /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)/, // ISO 8601
  /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/, // ISO without ms
  /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3})/, // MySQL with ms
  /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/, // MySQL
  /(\w{3} \d{1,2}, \d{4} \d{2}:\d{2}:\d{2})/, // Apache style
  /(\w{3} \d{1,2} \d{2}:\d{2}:\d{2})/, // Syslog
]

// Level pattern
const LEVEL_PATTERN = /\b(ERROR|WARN|WARNING|INFO|DEBUG|TRACE|FATAL|CRITICAL)\b/i

// Service pattern [service-name]
const SERVICE_PATTERN = /\[([a-zA-Z0-9_-]+)\]/

// Request ID pattern
const REQUEST_ID_PATTERN = /(req_[a-zA-Z0-9]+)/

// IP pattern
const IP_PATTERN = /\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/

// URL pattern
const URL_PATTERN = /https?:\/\/[^\s]+/

// UUID pattern
const UUID_PATTERN = /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i

// Status code pattern
const STATUS_CODE_PATTERN = /\b([45]\d{2})\b/

// Duration pattern
const DURATION_PATTERN = /(\d+(?:\.\d+)?)\s*ms\b/

function extractTimestamp(line: string): Date {
  for (const pattern of TIMESTAMP_PATTERNS) {
    const match = line.match(pattern)
    if (match) {
      const parsed = new Date(match[1])
      if (!Number.isNaN(parsed.getTime())) {
        return parsed
      }
    }
  }
  return new Date()
}

function extractLevel(line: string): LogLevel {
  const match = line.match(LEVEL_PATTERN)
  if (match) {
    const level = match[1].toUpperCase()
    if (level === 'WARNING') return 'WARN'
    if (level === 'FATAL' || level === 'CRITICAL') return 'ERROR'
    return level as LogLevel
  }
  return 'INFO'
}

function extractService(line: string): string {
  const match = line.match(SERVICE_PATTERN)
  return match ? match[1] : 'unknown'
}

function extractRequestId(line: string): string | undefined {
  const match = line.match(REQUEST_ID_PATTERN)
  return match ? match[1] : undefined
}

function extractMetadata(line: string): Record<string, string> {
  const metadata: Record<string, string> = {}
  
  const ipMatch = line.match(IP_PATTERN)
  if (ipMatch) metadata.ip = ipMatch[1]
  
  const urlMatch = line.match(URL_PATTERN)
  if (urlMatch) metadata.url = urlMatch[0]
  
  const uuidMatch = line.match(UUID_PATTERN)
  if (uuidMatch) metadata.uuid = uuidMatch[0]
  
  const statusMatch = line.match(STATUS_CODE_PATTERN)
  if (statusMatch) metadata.statusCode = statusMatch[1]
  
  const durationMatch = line.match(DURATION_PATTERN)
  if (durationMatch) metadata.duration = `${durationMatch[1]}ms`
  
  return metadata
}

function extractMessage(line: string): string {
  // Remove timestamp
  let message = line
  for (const pattern of TIMESTAMP_PATTERNS) {
    message = message.replace(pattern, '').trim()
  }
  // Remove level
  message = message.replace(LEVEL_PATTERN, '').trim()
  // Remove service tag
  message = message.replace(SERVICE_PATTERN, '').trim()
  
  return message || line
}

export function parseLogLine(line: string, index: number): ParsedLog {
  const trimmedLine = line.trim()
  if (!trimmedLine) {
    return {
      id: `log-${index}`,
      lineNumber: index + 1,
      timestamp: new Date(),
      level: 'INFO',
      service: 'unknown',
      message: '',
      rawLine: line,
      metadata: {},
    }
  }
  
  return {
    id: `log-${index}`,
    lineNumber: index + 1,
    timestamp: extractTimestamp(trimmedLine),
    level: extractLevel(trimmedLine),
    service: extractService(trimmedLine),
    message: extractMessage(trimmedLine),
    rawLine: trimmedLine,
    requestId: extractRequestId(trimmedLine),
    metadata: extractMetadata(trimmedLine),
  }
}

export function parseLogs(input: string): ParsedLog[] {
  const lines = input.split('\n').filter(line => line.trim())
  return lines.map((line, index) => parseLogLine(line, index))
}

export function filterLogs(
  logs: ParsedLog[],
  search: string,
  levels: LogLevel[],
  services: string[],
  useRegex: boolean,
  caseSensitive: boolean
): ParsedLog[] {
  return logs.filter(log => {
    // Level filter
    if (levels.length > 0 && !levels.includes(log.level)) {
      return false
    }
    
    // Service filter
    if (services.length > 0 && !services.includes(log.service)) {
      return false
    }
    
    // Search filter
    if (search) {
      const searchTarget = caseSensitive 
        ? log.rawLine 
        : log.rawLine.toLowerCase()
      const searchQuery = caseSensitive 
        ? search 
        : search.toLowerCase()
      
      if (useRegex) {
        try {
          const regex = new RegExp(search, caseSensitive ? '' : 'i')
          return regex.test(log.rawLine)
        } catch {
          return false
        }
      }
      
      return searchTarget.includes(searchQuery)
    }
    
    return true
  })
}

export function generateTimelineData(logs: ParsedLog[]): TimelineDataPoint[] {
  const hourlyBuckets: Map<string, { total: number; errors: number; warnings: number; info: number }> = new Map()
  
  for (const log of logs) {
    // Handle both Date objects and serialized date strings from localStorage
    const timestamp = log.timestamp instanceof Date ? log.timestamp : new Date(log.timestamp)
    const hour = new Date(timestamp)
    hour.setMinutes(0, 0, 0)
    const key = hour.toISOString()
    
    const bucket = hourlyBuckets.get(key) || { total: 0, errors: 0, warnings: 0, info: 0 }
    bucket.total++
    if (log.level === 'ERROR') bucket.errors++
    else if (log.level === 'WARN') bucket.warnings++
    else bucket.info++
    hourlyBuckets.set(key, bucket)
  }
  
  return Array.from(hourlyBuckets.entries())
    .map(([time, data]) => ({
      time: new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date(time),
      ...data,
    }))
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
}

export function detectPatterns(logs: ParsedLog[]): LogPattern[] {
  const errorLogs = logs.filter(l => l.level === 'ERROR')
  const patternGroups: Map<string, ParsedLog[]> = new Map()
  
  // Group by simplified message patterns
  for (const log of errorLogs) {
    // Simplify message to create pattern
    const pattern = log.message
      .replace(/\d+/g, 'N') // Replace numbers
      .replace(/req_[a-zA-Z0-9]+/g, 'REQ_ID') // Replace request IDs
      .replace(/\b[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\b/gi, 'UUID') // Replace UUIDs
      .replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, 'IP') // Replace IPs
      .substring(0, 100) // Limit pattern length
    
    const group = patternGroups.get(pattern) || []
    group.push(log)
    patternGroups.set(pattern, group)
  }
  
  return Array.from(patternGroups.entries())
    .map(([pattern, logList], index) => ({
      id: `pattern-${index}`,
      pattern,
      count: logList.length,
      percentage: errorLogs.length > 0 ? (logList.length / errorLogs.length) * 100 : 0,
      level: 'ERROR' as LogLevel,
      examples: logList.slice(0, 3).map(l => l.rawLine),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
}

export function generateInsights(logs: ParsedLog[], patterns: LogPattern[]): AIInsight[] {
  const insights: AIInsight[] = []
  const errorCount = logs.filter(l => l.level === 'ERROR').length
  const warnCount = logs.filter(l => l.level === 'WARN').length
  const totalCount = logs.length
  
  // Error rate insight
  if (totalCount > 0) {
    const errorRate = (errorCount / totalCount) * 100
    if (errorRate > 10) {
      insights.push({
        type: 'error-spike',
        title: 'High Error Rate Detected',
        description: `${errorRate.toFixed(1)}% of logs are errors (${errorCount} out of ${totalCount})`,
        severity: errorRate > 25 ? 'critical' : errorRate > 15 ? 'high' : 'medium',
        affectedLogs: logs.filter(l => l.level === 'ERROR').map(l => l.id),
        recommendation: 'Review the most common error patterns and check system health.',
      })
    }
  }
  
  // Pattern-based insights
  if (patterns.length > 0) {
    const topPattern = patterns[0]
    if (topPattern.count >= 3) {
      // Detect pattern type
      let recommendation = 'Review the error logs for more details.'
      const patternLower = topPattern.pattern.toLowerCase()
      
      if (patternLower.includes('timeout') || patternLower.includes('etimedout')) {
        recommendation = 'Check network connectivity and increase timeout limits if needed.'
      } else if (patternLower.includes('connection') || patternLower.includes('redis')) {
        recommendation = 'Verify connection pool settings and server availability.'
      } else if (patternLower.includes('auth') || patternLower.includes('unauthorized')) {
        recommendation = 'Review authentication configuration and credentials.'
      } else if (patternLower.includes('memory') || patternLower.includes('heap')) {
        recommendation = 'Consider increasing memory allocation or optimizing memory usage.'
      } else if (patternLower.includes('database') || patternLower.includes('query')) {
        recommendation = 'Check database connection and query performance.'
      }
      
      insights.push({
        type: 'pattern',
        title: `${topPattern.count} similar errors detected`,
        description: `Most common: "${topPattern.pattern.substring(0, 60)}${topPattern.pattern.length > 60 ? '...' : ''}"`,
        severity: topPattern.count > 10 ? 'high' : 'medium',
        affectedLogs: [],
        recommendation,
      })
    }
  }
  
  // Service-based insights
  const serviceErrors: Map<string, number> = new Map()
  for (const log of logs.filter(l => l.level === 'ERROR')) {
    serviceErrors.set(log.service, (serviceErrors.get(log.service) || 0) + 1)
  }
  
  const sortedServices = Array.from(serviceErrors.entries()).sort((a, b) => b[1] - a[1])
  if (sortedServices.length > 0 && sortedServices[0][1] >= 5) {
    const [service, count] = sortedServices[0]
    insights.push({
      type: 'recommendation',
      title: `[${service}] needs attention`,
      description: `Service has ${count} errors, accounting for ${((count / errorCount) * 100).toFixed(0)}% of all errors.`,
      severity: 'medium',
      affectedLogs: logs.filter(l => l.service === service && l.level === 'ERROR').map(l => l.id),
      recommendation: `Focus debugging efforts on the ${service} service.`,
    })
  }
  
  return insights
}

export function getUniqueServices(logs: ParsedLog[]): string[] {
  return Array.from(new Set(logs.map(l => l.service))).filter(s => s !== 'unknown')
}

export function getRelatedLogs(logs: ParsedLog[], requestId?: string): ParsedLog[] {
  if (!requestId) return []
  return logs.filter(l => l.requestId === requestId)
}

export function highlightLogMessage(message: string): { text: string; type: 'normal' | 'ip' | 'url' | 'uuid' | 'status' }[] {
  const parts: { text: string; type: 'normal' | 'ip' | 'url' | 'uuid' | 'status' }[] = []
  let remaining = message
  
  const patterns: { regex: RegExp; type: 'ip' | 'url' | 'uuid' | 'status' }[] = [
    { regex: /https?:\/\/[^\s]+/, type: 'url' },
    { regex: /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i, type: 'uuid' },
    { regex: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/, type: 'ip' },
    { regex: /\b[45]\d{2}\b/, type: 'status' },
  ]
  
  while (remaining) {
    let earliestMatch: { index: number; length: number; type: 'ip' | 'url' | 'uuid' | 'status' } | null = null
    
    for (const { regex, type } of patterns) {
      const match = remaining.match(regex)
      if (match && match.index !== undefined) {
        if (!earliestMatch || match.index < earliestMatch.index) {
          earliestMatch = { index: match.index, length: match[0].length, type }
        }
      }
    }
    
    if (earliestMatch) {
      if (earliestMatch.index > 0) {
        parts.push({ text: remaining.substring(0, earliestMatch.index), type: 'normal' })
      }
      parts.push({ 
        text: remaining.substring(earliestMatch.index, earliestMatch.index + earliestMatch.length), 
        type: earliestMatch.type 
      })
      remaining = remaining.substring(earliestMatch.index + earliestMatch.length)
    } else {
      parts.push({ text: remaining, type: 'normal' })
      break
    }
  }
  
  return parts
}

// Calculate quick stats from logs
export function calculateStats(logs: ParsedLog[]) {
  const totalLogs = logs.length
  const errorCount = logs.filter(l => l.level === 'ERROR').length
  const warnCount = logs.filter(l => l.level === 'WARN').length
  const errorRate = totalLogs > 0 ? (errorCount / totalLogs) * 100 : 0
  
  // Calculate average response time from logs with duration metadata
  const durationsMs: number[] = []
  for (const log of logs) {
    if (log.metadata?.duration) {
      const ms = parseFloat(log.metadata.duration.replace('ms', ''))
      if (!Number.isNaN(ms)) durationsMs.push(ms)
    }
  }
  const avgResponseTime = durationsMs.length > 0 
    ? durationsMs.reduce((a, b) => a + b, 0) / durationsMs.length 
    : 0
  
  const services = getUniqueServices(logs)
  
  return {
    totalLogs,
    errorCount,
    warnCount,
    errorRate,
    avgResponseTime,
    activeServices: services.length,
    services,
  }
}

export const SAMPLE_LOGS = `2024-02-01T09:00:15.234Z INFO [server] Application started on port 3000
2024-02-01T09:05:23.456Z INFO [api-gateway] GET /api/users 200 OK duration=45ms req_001
2024-02-01T09:10:12.789Z DEBUG [database] Connection pool initialized: 10 connections ready
2024-02-01T09:15:45.123Z INFO [auth] JWT token validated for user_8a4f2c req_002
2024-02-01T09:20:01.456Z WARN [memory] Heap usage at 78% - monitoring
2024-02-01T09:25:33.789Z INFO [api-gateway] POST /api/orders 201 Created duration=234ms req_003
2024-02-01T09:30:15.012Z ERROR [database] Query timeout after 30000ms: SELECT * FROM analytics WHERE... req_004
2024-02-01T09:30:15.234Z ERROR [api-gateway] 500 Internal Server Error for GET /api/analytics req_004
2024-02-01T09:35:22.567Z INFO [worker] Background job email-batch completed in 4.2s
2024-02-01T09:40:11.890Z WARN [rate-limit] Rate limit approaching for IP 192.168.1.100: 85/100 requests
2024-02-01T09:45:33.123Z INFO [cache] Cache hit ratio: 94.2% (last hour)
2024-02-01T09:50:45.456Z ERROR [auth] Authentication failed for user admin@company.com from 10.0.0.55 - invalid credentials
2024-02-01T09:50:46.789Z WARN [security] Multiple failed login attempts from 10.0.0.55
2024-02-01T09:55:12.012Z INFO [api-gateway] GET /api/products 200 OK duration=12ms req_005
2024-02-01T10:00:23.345Z DEBUG [database] Slow query detected: 1240ms for user_sessions lookup
2024-02-01T10:05:34.678Z INFO [deploy] Deployment v2.4.1 started by user deploy_bot
2024-02-01T10:10:45.901Z INFO [deploy] Health checks passing - rolling update at 50%
2024-02-01T10:15:56.234Z INFO [deploy] Deployment v2.4.1 completed successfully
2024-02-01T10:20:12.567Z ERROR [api-gateway] Connection refused to redis://10.0.4.12:6379 req_006
2024-02-01T10:20:13.890Z ERROR [api-gateway] ConnectionTimeoutError: Failed to connect to Redis cluster at 10.0.4.12:6379 req_006
2024-02-01T10:20:14.123Z WARN [retry] Retry attempt 1/3 for Redis connection req_006
2024-02-01T10:20:16.456Z WARN [retry] Retry attempt 2/3 for Redis connection req_006
2024-02-01T10:20:18.789Z INFO [retry] Connection restored to Redis cluster req_006
2024-02-01T10:25:21.012Z INFO [api-gateway] POST /api/checkout 200 OK duration=567ms req_007
2024-02-01T10:30:32.345Z WARN [database] Slow query detected (2340ms): UPDATE users SET last_login = NOW() WHERE id = 'u_942'
2024-02-01T10:35:43.678Z INFO [worker] Job background-sync-v2 started with correlation_id: req_9ab22
2024-02-01T10:40:54.901Z DEBUG [cache] Cache invalidated for pattern: product_catalog_*
2024-02-01T10:45:12.234Z ERROR [auth] Token expired for session sess_abc123 - user redirected to login
2024-02-01T10:50:23.567Z INFO [api-gateway] GET /api/user/profile 200 OK duration=45ms req_008
2024-02-01T10:55:34.890Z WARN [api-gateway] Response time exceeded threshold: 1890ms for GET /api/reports req_009
2024-02-01T11:00:45.123Z ERROR [database] Connection pool exhausted - 50/50 connections in use
2024-02-01T11:00:46.456Z CRITICAL [database] Unable to acquire database connection after 5000ms timeout
2024-02-01T11:00:47.789Z WARN [api-gateway] Circuit breaker opened for database service
2024-02-01T11:05:58.012Z INFO [database] Connection pool recovered - 35/50 connections available
2024-02-01T11:10:12.345Z INFO [api-gateway] Circuit breaker closed - database service healthy
2024-02-01T11:15:23.678Z DEBUG [auth] New session created: sess_def456 for user_id u_789
2024-02-01T11:20:34.901Z INFO [api-gateway] GET /api/dashboard 200 OK duration=89ms req_010
2024-02-01T11:25:45.234Z INFO [metrics] CPU usage: 42%, Memory: 68%, Disk I/O: 12%
2024-02-01T11:30:56.567Z WARN [security] Unusual traffic pattern detected from IP range 203.0.113.0/24
2024-02-01T11:35:12.890Z INFO [api-gateway] POST /api/webhook 200 OK duration=23ms req_011`
