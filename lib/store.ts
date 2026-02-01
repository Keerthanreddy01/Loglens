'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ParsedLog, LogFilter, LogLevel, SavedQuery, AIInsight, LogPattern } from './types'
import { parseLogs, filterLogs, detectPatterns, generateInsights, calculateStats, getUniqueServices, SAMPLE_LOGS } from './log-parser'

interface LogStore {
  // Raw input and parsed logs
  rawInput: string
  parsedLogs: ParsedLog[]
  
  // Selection
  selectedLogId: string | null
  
  // Filters
  filter: LogFilter
  
  // Smart filters (checkboxes)
  smartFilters: {
    criticalOnly: boolean
    performanceIssues: boolean
    securityEvents: boolean
    userActions: boolean
  }
  
  // Saved queries
  savedQueries: SavedQuery[]
  
  // AI Insights and patterns
  insights: AIInsight[]
  patterns: LogPattern[]
  
  // Stats
  stats: {
    totalLogs: number
    errorCount: number
    warnCount: number
    errorRate: number
    avgResponseTime: number
    activeServices: number
    services: string[]
  }
  
  // UI State
  isLiveTailEnabled: boolean
  isDetailsPanelOpen: boolean
  activeTab: 'overview' | 'live-logs' | 'analytics' | 'alerts'
  viewMode: 'compact' | 'comfortable'
  isPaused: boolean
  bufferedLogs: number
  
  // Actions
  setRawInput: (input: string) => void
  loadLogs: (input: string) => void
  loadSampleLogs: () => void
  clearLogs: () => void
  selectLog: (id: string | null) => void
  updateFilter: (filter: Partial<LogFilter>) => void
  toggleLevel: (level: LogLevel) => void
  setLevelFilter: (levels: LogLevel[]) => void
  toggleSmartFilter: (key: keyof LogStore['smartFilters']) => void
  addSavedQuery: (query: SavedQuery) => void
  removeSavedQuery: (id: string) => void
  applySavedQuery: (query: SavedQuery) => void
  setLiveTail: (enabled: boolean) => void
  toggleDetailsPanel: () => void
  setActiveTab: (tab: 'overview' | 'live-logs' | 'analytics' | 'alerts') => void
  setViewMode: (mode: 'compact' | 'comfortable') => void
  toggleLogExpanded: (id: string) => void
  setPaused: (paused: boolean) => void
  
  // Computed (derived from state)
  getFilteredLogs: () => ParsedLog[]
}

const defaultFilter: LogFilter = {
  search: '',
  levels: ['ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE'],
  services: [],
  timeRange: { start: null, end: null },
  useRegex: false,
  caseSensitive: false,
}

const defaultStats = {
  totalLogs: 0,
  errorCount: 0,
  warnCount: 0,
  errorRate: 0,
  avgResponseTime: 0,
  activeServices: 0,
  services: [] as string[],
}

export const useLogStore = create<LogStore>()(
  persist(
    (set, get) => ({
      rawInput: '',
      parsedLogs: [],
      selectedLogId: null,
      filter: defaultFilter,
      smartFilters: {
        criticalOnly: false,
        performanceIssues: false,
        securityEvents: false,
        userActions: false,
      },
      savedQueries: [
        {
          id: '1',
          name: 'Auth Failures',
          filter: { ...defaultFilter, search: 'auth', levels: ['ERROR'] },
          icon: 'star',
        },
        {
          id: '2',
          name: 'Vercel Deployment',
          filter: { ...defaultFilter, search: 'deploy' },
          icon: 'star',
        },
        {
          id: '3',
          name: 'Database Errors',
          filter: { ...defaultFilter, search: 'database', levels: ['ERROR'] },
          icon: 'star',
        },
      ],
      insights: [],
      patterns: [],
      stats: defaultStats,
      isLiveTailEnabled: true,
      isDetailsPanelOpen: true,
      activeTab: 'overview',
      viewMode: 'comfortable',
      isPaused: false,
      bufferedLogs: 0,

      setRawInput: (input) => set({ rawInput: input }),
      
      loadLogs: (input) => {
        const parsed = parseLogs(input)
        const patterns = detectPatterns(parsed)
        const insights = generateInsights(parsed, patterns)
        const stats = calculateStats(parsed)
        
        set({ 
          rawInput: input,
          parsedLogs: parsed,
          patterns,
          insights,
          stats,
        })
      },
      
      loadSampleLogs: () => {
        get().loadLogs(SAMPLE_LOGS)
      },
      
      clearLogs: () => {
        set({
          rawInput: '',
          parsedLogs: [],
          patterns: [],
          insights: [],
          stats: defaultStats,
          selectedLogId: null,
        })
      },
      
      selectLog: (id) => set({ selectedLogId: id, isDetailsPanelOpen: id !== null }),
      
      updateFilter: (newFilter) =>
        set((state) => ({
          filter: { ...state.filter, ...newFilter },
        })),
        
      toggleLevel: (level) =>
        set((state) => {
          const levels = state.filter.levels.includes(level)
            ? state.filter.levels.filter((l) => l !== level)
            : [...state.filter.levels, level]
          return { filter: { ...state.filter, levels } }
        }),
      
      setLevelFilter: (levels) =>
        set((state) => ({
          filter: { ...state.filter, levels },
        })),
        
      toggleSmartFilter: (key) =>
        set((state) => ({
          smartFilters: {
            ...state.smartFilters,
            [key]: !state.smartFilters[key],
          },
        })),
        
      addSavedQuery: (query) =>
        set((state) => ({
          savedQueries: [...state.savedQueries, query],
        })),
        
      removeSavedQuery: (id) =>
        set((state) => ({
          savedQueries: state.savedQueries.filter((q) => q.id !== id),
        })),
      
      applySavedQuery: (query) =>
        set({ filter: { ...query.filter } }),
        
      setLiveTail: (enabled) => set({ isLiveTailEnabled: enabled }),
      toggleDetailsPanel: () =>
        set((state) => ({ isDetailsPanelOpen: !state.isDetailsPanelOpen })),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setViewMode: (mode) => set({ viewMode: mode }),
      
      toggleLogExpanded: (id) =>
        set((state) => ({
          parsedLogs: state.parsedLogs.map((log) =>
            log.id === id ? { ...log, isExpanded: !log.isExpanded } : log
          ),
        })),
      
      setPaused: (paused) => set({ isPaused: paused }),
      
      getFilteredLogs: () => {
        const state = get()
        let logs = state.parsedLogs
        
        // Apply smart filters first
        if (state.smartFilters.criticalOnly) {
          logs = logs.filter(l => l.level === 'ERROR' || l.rawLine.toLowerCase().includes('critical') || l.rawLine.toLowerCase().includes('fatal') || l.rawLine.includes('500'))
        }
        if (state.smartFilters.performanceIssues) {
          logs = logs.filter(l => 
            l.rawLine.toLowerCase().includes('slow') || 
            l.rawLine.toLowerCase().includes('timeout') || 
            l.rawLine.toLowerCase().includes('latency') ||
            (l.metadata?.duration && parseFloat(l.metadata.duration) > 1000)
          )
        }
        if (state.smartFilters.securityEvents) {
          logs = logs.filter(l => 
            l.rawLine.toLowerCase().includes('auth') || 
            l.rawLine.toLowerCase().includes('login') || 
            l.rawLine.toLowerCase().includes('unauthorized') ||
            l.rawLine.includes('403') ||
            l.rawLine.includes('401')
          )
        }
        if (state.smartFilters.userActions) {
          logs = logs.filter(l => 
            l.rawLine.toLowerCase().includes('user') || 
            l.rawLine.toLowerCase().includes('session') || 
            l.rawLine.toLowerCase().includes('action')
          )
        }
        
        // Then apply regular filters
        return filterLogs(
          logs,
          state.filter.search,
          state.filter.levels,
          state.filter.services,
          state.filter.useRegex,
          state.filter.caseSensitive
        )
      },
    }),
    {
      name: 'loglens-storage',
      partialize: (state) => ({
        rawInput: state.rawInput,
        parsedLogs: state.parsedLogs,
        savedQueries: state.savedQueries,
        filter: state.filter,
        viewMode: state.viewMode,
        insights: state.insights,
        patterns: state.patterns,
        stats: state.stats,
      }),
    }
  )
)
