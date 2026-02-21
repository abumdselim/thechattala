import { createClient } from 'src/lib/supabase/server';
import { prisma } from 'src/lib/prisma';
import { redirect } from 'next/navigation';

const Layout = async ({ children }) => {
  const { user } = await createClient();

  if (!user) {
    redirect('/auth/login');
  }

  const adminUser = await prisma.user.findUnique({
    where: { email: user.email },
    select: { role: true, suspended: true }
  });

  if (!adminUser || adminUser.role !== 'ADMIN' || adminUser.suspended) {
    redirect('/');
  }

  return <>{children}</>;
};

export default Layout;