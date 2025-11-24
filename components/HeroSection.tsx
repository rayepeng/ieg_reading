'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { useGSAP } from '@gsap/react';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(TextPlugin);

export default function HeroSection() {
    const containerRef = useRef<HTMLElement>(null);
    const sloganRef = useRef<HTMLParagraphElement>(null);

    useGSAP(
        () => {
            if (sloganRef.current) {
                gsap.to(sloganRef.current, {
                    duration: 4,
                    text: {
                        value: "或许你不喜欢书，只是因为还不认识我们。",
                        delimiter: "",
                    },
                    ease: "none",
                    delay: 1,
                });
            }
        },
        { scope: containerRef }
    );

    return (
        <section ref={containerRef} className="relative h-screen flex flex-col items-center justify-center bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
            <div className="text-center space-y-8 z-10 px-4">
                <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tight">
                    IEG 读书会
                </h1>
                <p
                    ref={sloganRef}
                    className="text-xl md:text-2xl font-light h-8"
                ></p>
            </div>

            <div className="absolute bottom-10 animate-bounce">
                <div className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400">
                    <span className="text-sm">滑动或鼠标滚轮观看展览</span>
                    <ChevronDown className="w-6 h-6" />
                </div>
            </div>
        </section>
    );
}
