import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const data = await request.json();
        const { sessions, councilMembers } = data;

        if (sessions && Array.isArray(sessions)) {
            for (const s of sessions) {
                await prisma.session.create({
                    data: {
                        title: s.title,
                        date: new Date(s.date),
                        speaker: s.speaker,
                        description: s.description,
                        imageUrl: s.imageUrl,
                    },
                });
            }
        }

        if (councilMembers && Array.isArray(councilMembers)) {
            for (const m of councilMembers) {
                await prisma.councilMember.create({
                    data: {
                        name: m.name,
                        bio: m.bio,
                        imageUrl: m.imageUrl,
                        order: parseInt(m.order || '0'),
                    },
                });
            }
        }

        return NextResponse.json({ success: true, message: 'Import successful' });
    } catch (error) {
        console.error('Import error:', error);
        return NextResponse.json({ error: 'Import failed' }, { status: 500 });
    }
}
