import { PrismaClient } from '@prisma/client';
import ScrollLayout from '@/components/ScrollLayout';
import CouncilList from '@/components/CouncilList';
import HeroSection from '@/components/HeroSection';
import ThemeToggle from '@/components/ThemeToggle';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function Home() {
  const sessions = await prisma.session.findMany({
    orderBy: {
      date: 'desc',
    },
  });

  const councilMembers = await prisma.councilMember.findMany({
    orderBy: {
      order: 'asc',
    },
  });

  return (
    <main className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <ThemeToggle />
      <HeroSection />
      <CouncilList members={councilMembers} />
      <ScrollLayout sessions={sessions} />
    </main>
  );
}
