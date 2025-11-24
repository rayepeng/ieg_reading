import Image from 'next/image';
import { CouncilMember } from '@prisma/client';

interface CouncilListProps {
    members: CouncilMember[];
}

export default function CouncilList({ members }: CouncilListProps) {
    return (
        <div className="py-20 px-6 lg:px-10 bg-white">
            <h2 className="text-3xl font-serif font-bold text-center mb-12">理事会成员</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
                {members.map((member) => (
                    <div key={member.id} className="flex flex-col items-center text-center">
                        <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden shadow-lg">
                            {member.imageUrl ? (
                                <Image
                                    src={member.imageUrl}
                                    alt={member.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    No Image
                                </div>
                            )}
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                        <p className="text-sm text-gray-600">{member.bio}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
