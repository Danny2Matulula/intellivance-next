"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ScrollCTA() {
    const [visible, setVisible] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (dismissed) return;
            const scrollPct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
            setVisible(scrollPct > 0.5 && scrollPct < 0.85);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [dismissed]);

    if (dismissed || !visible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-700 bg-neutral-900 text-[#EAEAE5] py-3 px-4 sm:px-6 flex items-center justify-between gap-4 animate-in">
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <span className="text-sm truncate hidden sm:inline">Find your biggest automation win in 3 minutes</span>
                <span className="text-sm truncate sm:hidden">Free AI Readiness Assessment</span>
                <Link
                    href="/assessment"
                    className="shrink-0 bg-[#EAEAE5] text-neutral-900 px-4 py-1.5 mono text-[10px] uppercase tracking-wider hover:bg-white transition-colors"
                >
                    Take the Assessment
                </Link>
            </div>
            <button
                onClick={() => setDismissed(true)}
                className="shrink-0 text-neutral-500 hover:text-white transition-colors text-lg leading-none px-1"
                aria-label="Dismiss"
            >
                &times;
            </button>
        </div>
    );
}
