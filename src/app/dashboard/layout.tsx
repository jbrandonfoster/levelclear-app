import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { BottomNav } from '@/components/BottomNav';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <main className="pb-20">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
