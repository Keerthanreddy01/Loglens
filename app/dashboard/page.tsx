import { withAuth } from '@workos-inc/authkit-nextjs';
import DashboardClient from './DashboardClient';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
    const { user } = await withAuth({ ensureSignedIn: true });

    return <DashboardClient user={user} />;
}
