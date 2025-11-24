import Image from "next/image";
import { PrismaClient } from '@prisma/client';
import ScrollLayout from '@/components/ScrollLayout';
import CouncilList from '@/components/CouncilList';

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
    <main className="min-h-screen">
      <CouncilList members={councilMembers} />
      <ScrollLayout sessions={sessions} />
    </main>
  );
}
