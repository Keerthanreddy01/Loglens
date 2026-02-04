/**
 * Application Constants
 */

export const APP_NAME = 'LogLens';
export const APP_DESCRIPTION = 'Infrastructure intelligence, decoded in real time.';

export const ROUTES = {
    LANDING: '/',
    DASHBOARD: '/dashboard',
    LOGIN: '/login',
    API_AUTH_CALLBACK: '/api/auth/callback',
};

export const LOG_LEVELS = ['ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE', 'TRACE', 'FATAL', 'CRITICAL'] as const;

export const DATE_FORMATS = {
    DISPLAY: 'MMM dd, yyyy HH:mm:ss',
    ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSX",
};

export const CACHE_KEYS = {
    USER_LOGS: 'loglens_user_logs',
    UI_STATE: 'loglens_ui_state',
};
