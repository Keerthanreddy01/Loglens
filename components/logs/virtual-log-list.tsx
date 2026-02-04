'use client'

import { useRef, useCallback } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { ParsedLog } from '@/types/log'

const ROW_HEIGHT = 40

interface VirtualLogListProps {
  logs: ParsedLog[]
  renderRow: (log: ParsedLog, index: number) => React.ReactNode
  className?: string
}

export function VirtualLogList({ logs, renderRow, className = '' }: VirtualLogListProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: logs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 15,
  })

  const virtualItems = rowVirtualizer.getVirtualItems()

  return (
    <div
      ref={parentRef}
      className={`flex-1 overflow-auto custom-scrollbar ${className}`}
      style={{ contain: 'strict' }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualRow) => {
          const log = logs[virtualRow.index]
          if (!log) return null
          return (
            <div
              key={log.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {renderRow(log, virtualRow.index)}
            </div>
          )
        })}
      </div>
    </div>
  )
}

