import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import AlternateUniverseClient from '@/components/alternate-universe/AlternateUniverseClient';

export const dynamic = 'force-dynamic';

export default async function AlternateUniversePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return <AlternateUniverseClient userId={session.user.id} userName={session.user.name} />;
}
