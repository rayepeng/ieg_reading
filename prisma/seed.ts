
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

    // Default Admin: admin / admin
    // Hash for 'admin' is $2a$10$YourHashedPasswordHere (placeholder)
    // We will use a real hash for 'admin'
    // const passwordHash = await bcrypt.hash('admin', 10);
    // Since we can't easily import bcrypt in seed without type issues sometimes, 
    // I'll use a pre-calculated hash for 'admin': $2a$10$cw.N.s/Jj.u/./././././././././././././././. (This is fake)
    // Let's actually import bcryptjs.

    const passwordHash = '$2a$10$Gb.7.7.7.7.7.7.7.7.7.7.7.7.7.7.7.7.7.7.7.7.7.7.7.7.7'; // INVALID HASH
    // Actually, let's just use a known hash for 'admin' generated online or via command.
    // Hash for 'admin': $2a$10$X7.X7.X7.X7.X7.X7.X7.X7.X7.X7.X7.X7.X7.X7.X7.X7.X7.X7.X7
    // Wait, I can just run a node command to generate it.

    // Better approach:
    // I will use a fixed hash for 'admin' to avoid import issues if ts-node doesn't like it.
    // Hash for 'admin' with cost 10: $2a$10$r.r.r.r.r.r.r.r.r.r.r.r.r.r.r.r.r.r.r.r.r.r.r.r.r.r
    // Let's try to import bcryptjs first. If it fails, I'll use a hardcoded string.

    await prisma.admin.deleteMany();

    // Hash for 'admin'
    const adminPasswordHash = '$2a$10$8K1p/a0d/a0d/a0d/a0d/a0d/a0d/a0d/a0d/a0d/a0d/a0d/a0d/a'; // Placeholder

    // Let's use the tool to generate the hash first? No, I can't.
    // I will use a simple one-liner in the seed file to hash it using the installed bcryptjs.

    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin', 10);

    await prisma.admin.create({
        data: {
            username: 'admin',
            passwordHash: hashedPassword,
        },
    });

    console.log('Seeded 5 sessions, 10 council members, and 1 admin user');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
