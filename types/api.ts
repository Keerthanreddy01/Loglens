/**
 * API Related Types
 */

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export interface AuthUserInfo {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePictureUrl?: string;
}

export interface LogIngestionRequest {
  source: string;
  logs: string;
  format?: 'json' | 'text' | 'syslog';
}

export interface AnalyticsSummary {
  period: '1h' | '24h' | '7d' | '30d';
  totalLogs: number;
  errorRate: number;
  criticalIssues: number;
}
