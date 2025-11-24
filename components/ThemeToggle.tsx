'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="fixed top-4 right-4 z-50 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/20 transition-all"
            aria-label="Toggle Theme"
        >
            {theme === 'dark' ? (
                <Sun className="w-6 h-6 text-yellow-400" />
            ) : (
                <Moon className="w-6 h-6 text-slate-700" />
            )}
        </button>
    );
}
