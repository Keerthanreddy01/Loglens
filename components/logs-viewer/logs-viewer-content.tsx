'use client'

import React from "react"

import { useEffect, useRef, useState, useMemo } from 'react'
import { Search, Filter, ChevronDown, Copy, ExternalLink } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useLogStore } from '@/lib/store'
import { generateSampleLogs } from '@/lib/sample-data'
import { cn } from '@/lib/utils'
import type { LogLevel, ParsedLog } from '@/lib/types'

// Virtual scrolling constants
const ROW_HEIGHT = 40
const BUFFER_SIZE = 10

const levelStyles: Record<LogLevel, string> = {
  ERROR: 'bg-error text-white',
  WARN: 'bg-warning text-black',
  INFO: 'bg-info text-white',
  DEBUG: 'bg-muted-foreground text-white',
  TRACE: 'bg-muted text-foreground',
}

interface VirtualLogRowProps {
  log: ParsedLog
  style: React.CSSProperties
  isSelected: boolean
  isExpanded: boolean
  onSelect: () => void
  onToggleExpand: () => void
}

function VirtualLogRow({ log, style, isSelected, isExpanded, onSelect, onToggleExpand }: VirtualLogRowProps) {
  const timestamp = log.timestamp.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
  })
  
  return (
    <div style={style}>
      <button
        onClick={onSelect}
        className={cn(
          'w-full text-left flex items-center gap-3 px-4 h-10 font-mono text-xs border-b border-border transition-colors',
          'hover:bg-secondary/50',
          isSelected && 'bg-primary/5 border-l-2 border-l-primary'
        )}
      >
        <span className="text-muted-foreground w-8 text-right shrink-0">
          {log.lineNumber}
        </span>
        <span className="text-muted-foreground w-24 shrink-0">
          {timestamp}
        </span>
        <Badge className={cn('text-xs px-1.5 py-0 w-14 justify-center shrink-0', levelStyles[log.level])}>
          {log.level}
        </Badge>
        <span className="text-primary w-28 truncate shrink-0">
          [{log.service}]
        </span>
        <span className="text-foreground flex-1 truncate">
          {log.message}
        </span>
        {log.stackTrace && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleExpand()
            }}
            className="p-1 hover:bg-secondary rounded"
          >
            <ChevronDown className={cn('w-4 h-4 transition-transform', isExpanded && 'rotate-180')} />
          </button>
        )}
      </button>
      
      {/* Expanded Stack Trace */}
      {isExpanded && log.stackTrace && (
        <div className="bg-secondary/50 border-b border-border px-4 py-3 ml-12">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-medium">Stack Trace</span>
            <Button variant="ghost" size="sm" className="h-6 text-xs">
              <Copy className="w-3 h-3 mr-1" />
              Copy
            </Button>
          </div>
          <pre className="text-xs font-mono text-muted-foreground">
            {log.stackTrace.join('\n')}
          </pre>
        </div>
      )}
    </div>
  )
}

export function LogsViewerContent() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)
  
  const {
    parsedLogs,
    setParsedLogs,
    filter,
    updateFilter,
    selectedLogId,
    selectLog,
    toggleLogExpanded,
  } = useLogStore()
  
  // Generate more sample logs for virtual scrolling demo
  useEffect(() => {
    if (parsedLogs.length < 100) {
      const baseLogs = generateSampleLogs()
      const manyLogs: ParsedLog[] = []
      
      for (let i = 0; i < 1000; i++) {
        const baseLog = baseLogs[i % baseLogs.length]
        manyLogs.push({
          ...baseLog,
          id: `log-${i}`,
          lineNumber: i + 1,
          timestamp: new Date(Date.now() - (1000 - i) * 1000),
        })
      }
      
      setParsedLogs(manyLogs)
    }
  }, [parsedLogs.length, setParsedLogs])
  
  // Filter logs
  const filteredLogs = useMemo(() => {
    return parsedLogs.filter((log) => {
      if (!filter.levels.includes(log.level)) return false
      if (filter.search) {
        const searchLower = filter.search.toLowerCase()
        if (!log.message.toLowerCase().includes(searchLower) &&
            !log.service.toLowerCase().includes(searchLower)) {
          return false
        }
      }
      return true
    })
  }, [parsedLogs, filter])
  
  // Handle scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }
  
  // Update container height on resize
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight)
      }
    }
    
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])
  
  // Calculate visible range
  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER_SIZE)
  const endIndex = Math.min(
    filteredLogs.length,
    Math.ceil((scrollTop + containerHeight) / ROW_HEIGHT) + BUFFER_SIZE
  )
  
  const visibleLogs = filteredLogs.slice(startIndex, endIndex)
  const totalHeight = filteredLogs.length * ROW_HEIGHT
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={filter.search}
            onChange={(e) => updateFilter({ search: e.target.value })}
            className="pl-10 bg-secondary border-border"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredLogs.length.toLocaleString()} logs
        </div>
      </div>
      
      {/* Column Headers */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-border bg-secondary/50 text-xs font-medium text-muted-foreground">
        <span className="w-8 text-right">#</span>
        <span className="w-24">Timestamp</span>
        <span className="w-14 text-center">Level</span>
        <span className="w-28">Service</span>
        <span className="flex-1">Message</span>
      </div>
      
      {/* Virtual Scrolling Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto"
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          {visibleLogs.map((log, index) => {
            const actualIndex = startIndex + index
            return (
              <VirtualLogRow
                key={log.id}
                log={log}
                style={{
                  position: 'absolute',
                  top: actualIndex * ROW_HEIGHT,
                  left: 0,
                  right: 0,
                  height: ROW_HEIGHT,
                }}
                isSelected={selectedLogId === log.id}
                isExpanded={log.isExpanded || false}
                onSelect={() => selectLog(log.id)}
                onToggleExpand={() => toggleLogExpanded(log.id)}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
