import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessions = await prisma.session.findMany({
        orderBy: { date: 'desc' },
    });
    return NextResponse.json(sessions);
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const newSession = await prisma.session.create({
        data: {
            ...data,
            date: new Date(data.date),
        },
    });
    return NextResponse.json(newSession);
}

export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { id, ...rest } = data;
    const updatedSession = await prisma.session.update({
        where: { id },
        data: {
            ...rest,
            date: new Date(rest.date),
        },
    });
    return NextResponse.json(updatedSession);
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    await prisma.session.delete({
        where: { id: parseInt(id) },
    });
    return NextResponse.json({ success: true });
}
