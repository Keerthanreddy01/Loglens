import { withAuth } from '@workos-inc/authkit-nextjs';
import LandingClient from './LandingClient';
import { isNotFoundError } from 'next/dist/client/components/not-found';

export default async function LandingPage() {
  let user = null;
  try {
    const userInfo = await withAuth({});
    user = userInfo?.user || null;
  } catch (error) {
    // Ignore auth errors on landing page - user can still view it
    console.error('WorkOS Auth Error:', error);
  }

  return <LandingClient user={user} />;
}