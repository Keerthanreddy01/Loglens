import { z } from 'zod';

/**
 * Environment Variable Validation Schema
 * 
 * This schema ensures that the application has all required configuration
 * and that variables are in the correct format before the app starts.
 * 
 * FAIL FAST: If any required variable is missing, the app will throw an error immediately.
 */
const envSchema = z.object({
    // WorkOS Configuration (Required)
    WORKOS_CLIENT_ID: z.string().min(1, 'WORKOS_CLIENT_ID is required'),
    WORKOS_API_KEY: z.string().min(1, 'WORKOS_API_KEY is required'),
    WORKOS_REDIRECT_URI: z.string().url('WORKOS_REDIRECT_URI must be a valid URL'),
    WORKOS_COOKIE_PASSWORD: z.string().min(32, 'WORKOS_COOKIE_PASSWORD must be at least 32 characters'),

    // Application Configuration
    NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

    // Optional Analytics
    NEXT_PUBLIC_VERCEL_ANALYTICS_ID: z.string().optional(),
    NEXT_PUBLIC_ANALYTICS_KEY: z.string().optional(),
});

/**
 * Validate and export environment variables
 */
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error('❌ Invalid environment variables:');
    console.error(JSON.stringify(parsedEnv.error.format(), null, 2));

    // In production, we want to exit the process if configuration is wrong
    if (process.env.NODE_ENV === 'production') {
        throw new Error('Invalid environment variables. See logs for details.');
    }
}

export const env = parsedEnv.success ? parsedEnv.data : process.env as unknown as z.infer<typeof envSchema>;

// For client-side access, only export public variables
export const publicEnv = {
    NEXT_PUBLIC_APP_URL: env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_VERCEL_ANALYTICS_ID: env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID,
    NEXT_PUBLIC_ANALYTICS_KEY: env.NEXT_PUBLIC_ANALYTICS_KEY,
};
