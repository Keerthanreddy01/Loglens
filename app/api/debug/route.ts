import { NextResponse } from 'next/server';

export async function GET() {
    // Check environment variables
    const config = {
        hasClientId: !!process.env.WORKOS_CLIENT_ID,
        hasApiKey: !!process.env.WORKOS_API_KEY,
        hasRedirectUri: !!process.env.WORKOS_REDIRECT_URI,
        hasCookiePassword: !!process.env.WORKOS_COOKIE_PASSWORD,
        clientId: process.env.WORKOS_CLIENT_ID,
        redirectUri: process.env.WORKOS_REDIRECT_URI,
        apiKeyPrefix: process.env.WORKOS_API_KEY?.substring(0, 10) + '...',
    };

    return NextResponse.json(config);
}
