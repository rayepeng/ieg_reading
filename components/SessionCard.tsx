import Image from 'next/image';
import { Session } from '@prisma/client';

interface SessionCardProps {
    session: Session;
}

export default function SessionCard({ session }: SessionCardProps) {
    return (
        <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen w-full p-8 lg:p-20 gap-10">
            <div className="w-full lg:w-1/2 max-w-2xl">
                {session.imageUrl ? (
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl shadow-2xl">
                        <Image
                            src={session.imageUrl}
                            alt={session.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                ) : (
                    <div className="aspect-[4/3] w-full bg-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                        No Image
                    </div>
                )}
            </div>
            <div className="w-full lg:w-1/2 max-w-xl space-y-6">
                <div className="space-y-2">
                    <p className="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400">
                        {new Date(session.date).toLocaleDateString('zh-CN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </p>
                    <h2 className="text-4xl lg:text-6xl font-serif font-bold text-gray-900 dark:text-white">
                        {session.title}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                        分享人：{session.speaker}
                    </p>
                </div>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    {session.description}
                </p>
            </div>
        </div>
    );
}
