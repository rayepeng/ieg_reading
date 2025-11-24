'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Session } from '@prisma/client';
import SessionCard from './SessionCard';

gsap.registerPlugin(ScrollTrigger);

interface ScrollLayoutProps {
    sessions: Session[];
}

export default function ScrollLayout({ sessions }: ScrollLayoutProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const panelsRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const panels = gsap.utils.toArray<HTMLElement>('.session-panel');

            if (panels.length === 0) return;

            gsap.to(panels, {
                xPercent: -100 * (panels.length - 1),
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    pin: true,
                    scrub: 1,
                    snap: 1 / (panels.length - 1),
                    end: () => '+=' + containerRef.current!.offsetWidth * panels.length,
                },
            });
        },
        { scope: containerRef }
    );

    return (
        <div ref={containerRef} className="relative h-screen overflow-hidden bg-[#EAEAEA]">
            <div
                ref={panelsRef}
                className="flex h-full w-[300%] flex-nowrap"
                style={{ width: `${sessions.length * 100}%` }}
            >
                {sessions.map((session) => (
                    <div
                        key={session.id}
                        className="session-panel h-full w-screen flex-shrink-0 flex items-center justify-center"
                    >
                        <SessionCard session={session} />
                    </div>
                ))}
            </div>
        </div>
    );
}
