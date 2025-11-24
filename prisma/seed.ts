
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.session.deleteMany();
    await prisma.councilMember.deleteMany();

    const sessions = [
        {
            title: '第1期：如何阅读一本书',
            date: new Date('2018-01-01'),
            speaker: '张三',
            description: '分享关于阅读的方法论，如何快速掌握一本书的核心内容。',
            imageUrl: 'https://picsum.photos/seed/1/800/600',
        },
        {
            title: '第2期：人类简史',
            date: new Date('2018-02-01'),
            speaker: '李四',
            description: '回顾人类发展的历史，探讨未来的可能性。',
            imageUrl: 'https://picsum.photos/seed/2/800/600',
        },
        {
            title: '第3期：三体',
            date: new Date('2018-03-01'),
            speaker: '王五',
            description: '中国科幻的巅峰之作，探讨宇宙社会学。',
            imageUrl: 'https://picsum.photos/seed/3/800/600',
        },
        {
            title: '第4期：百年孤独',
            date: new Date('2018-04-01'),
            speaker: '赵六',
            description: '魔幻现实主义的代表作，讲述布恩迪亚家族七代人的传奇故事。',
            imageUrl: 'https://picsum.photos/seed/4/800/600',
        },
        {
            title: '第5期：穷查理宝典',
            date: new Date('2018-05-01'),
            speaker: '钱七',
            description: '查理·芒格的智慧箴言，关于投资与人生的思考。',
            imageUrl: 'https://picsum.photos/seed/5/800/600',
        },
    ];

    for (const session of sessions) {
        await prisma.session.create({
            data: session,
        });
    }

    const councilMembers = Array.from({ length: 10 }).map((_, i) => ({
        name: `理事 ${i + 1} `,
        bio: '热爱阅读，致力于推广全民阅读。',
        imageUrl: `https://picsum.photos/seed/c${i}/200/200`,
        order: i,
    }));

    for (const member of councilMembers) {
        await prisma.councilMember.create({
            data: member,
        });
    }

    console.log('Seeded 5 sessions and 10 council members');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
