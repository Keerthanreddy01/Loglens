import { authkitMiddleware } from '@workos-inc/authkit-nextjs';
import { env } from './lib/validators';

export default authkitMiddleware({
    middlewareAuth: {
        enabled: true,
        unauthenticatedPaths: [
            '/',
            '/login',
            '/api/auth/login',
            '/api/auth/callback',
            '/api/auth/logout',
        ],
    },
    redirectUri: env.WORKOS_REDIRECT_URI,
});

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (svg, png, jpg, etc.)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
