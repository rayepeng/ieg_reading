import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const members = await prisma.councilMember.findMany({
        orderBy: { order: 'asc' },
    });
    return NextResponse.json(members);
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const newMember = await prisma.councilMember.create({
        data: {
            ...data,
            order: parseInt(data.order || '0'),
        },
    });
    return NextResponse.json(newMember);
}

export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { id, ...rest } = data;
    const updatedMember = await prisma.councilMember.update({
        where: { id },
        data: {
            ...rest,
            order: parseInt(rest.order || '0'),
        },
    });
    return NextResponse.json(updatedMember);
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

    await prisma.councilMember.delete({
        where: { id: parseInt(id) },
    });
    return NextResponse.json({ success: true });
}
