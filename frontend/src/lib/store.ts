'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ParsedLog, LogFilter, LogLevel, SavedQuery, AIInsight, LogPattern, AlertRule, AnalysisSession } from './types'
import { parseLogs, filterLogs, detectPatterns, generateInsights, calculateStats, SAMPLE_LOGS } from './log-parser'

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
  isAiInsightCollapsed: boolean
  isFocusMode: boolean

  // Settings
  settings: {
    showAiInsights: boolean
    soundsEnabled: boolean
    notifications: {
      critical: boolean
      warning: boolean
      info: boolean
    }
    volume: 'low' | 'medium' | 'high'
  }

  // Sessions & Alerts
  savedSessions: AnalysisSession[]
  alertRules: AlertRule[]
  comparisonLogs: ParsedLog[] // For multi-file comparison

  // Loading state
  isLoading: boolean

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
  toggleAiInsightCollapsed: () => void
  setFocusMode: (enabled: boolean) => void
  updateSettings: (settings: Partial<LogStore['settings']>) => void

  // Session actions
  saveSession: (name: string) => void
  loadSession: (id: string) => void
  deleteSession: (id: string) => void

  // Alert actions
  addAlertRule: (rule: Omit<AlertRule, 'id' | 'status' | 'triggerCount' | 'lastTriggered' | 'createdAt'>) => void
  createAlertFromPattern: (pattern: LogPattern) => void
  updateAlertRule: (id: string, updates: Partial<AlertRule>) => void
  removeAlertRule: (id: string) => void

  // Multi-file comparison
  loadLogsForComparison: (input: string) => void
  clearComparison: () => void

  // Real-time streaming simulation
  appendStreamingLogs: (logs: ParsedLog[]) => void

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
      isAiInsightCollapsed: false,
      isFocusMode: false,
      settings: {
        showAiInsights: true,
        soundsEnabled: false,
        notifications: {
          critical: true,
          warning: true,
          info: false,
        },
        volume: 'medium',
      },
      savedSessions: [],
      alertRules: [],
      comparisonLogs: [],
      isLoading: false,

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
      toggleAiInsightCollapsed: () => set((state) => ({ isAiInsightCollapsed: !state.isAiInsightCollapsed })),
      setFocusMode: (enabled) => set({ isFocusMode: enabled }),
      updateSettings: (newSettings) => set((state) => ({ settings: { ...state.settings, ...newSettings } })),

      saveSession: (name) => {
        const state = get()
        const session: AnalysisSession = {
          id: `session-${Date.now()}`,
          name,
          createdAt: new Date().toISOString(),
          rawInput: state.rawInput,
          parsedLogs: state.parsedLogs,
          filter: state.filter,
          stats: state.stats,
          patterns: state.patterns,
          insights: state.insights,
        }
        set((s) => ({ savedSessions: [session, ...s.savedSessions].slice(0, 20) }))
      },

      loadSession: (id) => {
        const state = get()
        const session = state.savedSessions.find((s) => s.id === id)
        if (session) {
          set({
            rawInput: session.rawInput,
            parsedLogs: session.parsedLogs,
            filter: session.filter,
            stats: session.stats,
            patterns: session.patterns,
            insights: session.insights,
          })
        }
      },

      deleteSession: (id) =>
        set((s) => ({ savedSessions: s.savedSessions.filter((x) => x.id !== id) })),

      addAlertRule: (rule) => {
        const newRule: AlertRule = {
          ...rule,
          id: `alert-${Date.now()}`,
          status: 'resolved',
          triggerCount: 0,
          lastTriggered: 'Never',
          createdAt: new Date().toISOString(),
        }
        set((s) => ({ alertRules: [...s.alertRules, newRule] }))
      },

      createAlertFromPattern: (pattern) => {
        const severity = (pattern.confidenceScore ?? 80) > 90 ? 'critical' as const : (pattern.confidenceScore ?? 80) > 70 ? 'warning' as const : 'info' as const
        get().addAlertRule({
          name: `Pattern: ${pattern.pattern.substring(0, 40)}${pattern.pattern.length > 40 ? '...' : ''}`,
          condition: `Error pattern "${pattern.pattern.substring(0, 30)}..." occurs > ${Math.max(2, pattern.count - 1)} times`,
          pattern: pattern.pattern,
          severity,
          enabled: true,
        })
      },

      updateAlertRule: (id, updates) =>
        set((s) => ({
          alertRules: s.alertRules.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        })),

      removeAlertRule: (id) =>
        set((s) => ({ alertRules: s.alertRules.filter((r) => r.id !== id) })),

      loadLogsForComparison: (input) => {
        const parsed = parseLogs(input)
        set({ comparisonLogs: parsed })
      },

      clearComparison: () => set({ comparisonLogs: [] }),

      appendStreamingLogs: (logs) => {
        const state = get()
        const newLogs = [...state.parsedLogs, ...logs]
        const patterns = detectPatterns(newLogs)
        const insights = generateInsights(newLogs, patterns)
        const stats = calculateStats(newLogs)
        set({
          parsedLogs: newLogs,
          bufferedLogs: state.bufferedLogs + logs.length,
          patterns,
          insights,
          stats,
        })
      },

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
        savedSessions: state.savedSessions,
        alertRules: state.alertRules,
        isAiInsightCollapsed: state.isAiInsightCollapsed,
        isFocusMode: state.isFocusMode,
        settings: state.settings,
      }),
    }
  )
)

