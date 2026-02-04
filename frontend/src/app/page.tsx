import { withAuth } from '@workos-inc/authkit-nextjs';
import LandingClient from './LandingClient';

export default async function LandingPage() {
  let user = null;

  try {
    const userInfo = await withAuth({});
    user = userInfo?.user || null;
  } catch {
    // Ignore auth errors on landing page - user can still view it
    // Using warn to avoid triggering the Next.js dev error overlay for non-critical auth issues
    // console.warn('WorkOS Auth optional check failed:', error instanceof Error ? error.message : error);
  }

  return <LandingClient user={user} />;
}
