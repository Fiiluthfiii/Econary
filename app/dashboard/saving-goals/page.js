import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import SavingGoalsClient from '@/components/saving-goals/SavingGoalsClient';

export const dynamic = 'force-dynamic';

export default async function SavingGoalsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return <SavingGoalsClient userId={session.user.id} userName={session.user.name} />;
}
