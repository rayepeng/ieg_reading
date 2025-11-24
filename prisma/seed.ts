
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.session.deleteMany();
    await prisma.councilMember.deleteMany();

    const sessions = [
        {
            title: "第1期：霍乱时期的爱情",
            date: new Date("2022-02-20"),
            speaker: "小江村儿的文杰",
            description: "探讨加西亚·马尔克斯的经典作品《霍乱时期的爱情》，一段跨越半个世纪的爱情故事。",
            imageUrl: "https://picsum.photos/seed/1/800/600"
        },
        {
            title: "第2期：呼啸山庄",
            date: new Date("2022-05-21"),
            speaker: "小江村儿的文杰",
            description: "分享艾米莉·勃朗特的《呼啸山庄》，揭示其深刻的爱与复仇主题。",
            imageUrl: "https://picsum.photos/seed/2/800/600"
        },
        {
            title: "第3期：三体/黑暗森林",
            date: new Date("2022-07-24"),
            speaker: "小江村儿的文杰",
            description: "讨论刘慈欣的科幻巨作《三体》和《黑暗森林》，探索人类文明与外星文明的碰撞。",
            imageUrl: "https://picsum.photos/seed/3/800/600"
        },
        {
            title: "第4期：置身事内",
            date: new Date("2022-09-18"),
            speaker: "Bob",
            description: "分享《置身事内》这本书，探讨自我提升与内心觉察的过程。",
            imageUrl: "https://picsum.photos/seed/4/800/600"
        },
        {
            title: "第5期：人性的枷锁",
            date: new Date("2022-09-25"),
            speaker: "大鲸鱼",
            description: "讲述威廉·萨默塞特·毛姆的经典小说《人性的枷锁》，分析人物的心理成长与困境。",
            imageUrl: "https://picsum.photos/seed/5/800/600"
        }
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

    const bcrypt = await import('bcryptjs');
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
