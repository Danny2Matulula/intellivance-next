"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
    const [showLogin, setShowLogin] = useState(false);
    const [loginError, setLoginError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const handler = () => { setShowLogin(true); setLoginError(false); };
        window.addEventListener('open-login-modal', handler);
        return () => window.removeEventListener('open-login-modal', handler);
    }, []);

    function handleLogin(e) {
        e.preventDefault();
        setIsSubmitting(true);
        setLoginError(false);
        setTimeout(() => {
            setIsSubmitting(false);
            setLoginError(true);
        }, 1200);
    }

    return (
        <>
            <nav className="fixed top-0 left-0 w-full z-50 bg-[#EAEAE5]/90 backdrop-blur-md border-b border-theme h-16 flex items-center justify-between px-6 lg:px-12">
                <div className="flex items-center gap-12">
                    <Link href="/" className="flex items-center gap-2.5 group iv-logo-link">
                        <svg
                            className="iv-logo"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="60 90 280 340"
                            width="28"
                            height="40"
                        >
                            {/* Stacked bars — bottom to top */}
                            <rect className="iv-bar iv-bar-1" x="185" y="385" width="30" height="30" rx="4" fill="#1A1A1A" />
                            <rect className="iv-bar iv-bar-2" x="182" y="345" width="36" height="30" rx="4" fill="#2A2A2A" />
                            <rect className="iv-bar iv-bar-3" x="179" y="305" width="42" height="30" rx="4" fill="#3A3A3A" />
                            <rect className="iv-bar iv-bar-4" x="176" y="265" width="48" height="30" rx="4" fill="#4A4A4A" />
                            <rect className="iv-bar iv-bar-5" x="173" y="225" width="54" height="30" rx="4" fill="#5A5A5A" />
                            {/* Triangle iris */}
                            <polygon className="iv-iris" points="200,110 232,165 168,165" fill="#1A1A1A" />
                        </svg>
                        <span className="mono font-bold tracking-tight text-lg">
                            INTELLIVANCE
                        </span>
                    </Link>
                    <div className="hidden md:flex gap-8 mono text-xs text-neutral-500">
                        <Link href="/#method" className="hover:text-black transition-colors">
                            PROCESS
                        </Link>
                        <Link href="/#proof" className="hover:text-black transition-colors">
                            RESULTS
                        </Link>
                        <Link href="/about" className="hover:text-black transition-colors">
                            ABOUT
                        </Link>
                        <Link href="/blog" className="hover:text-black transition-colors">
                            BLOG
                        </Link>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden lg:flex items-center gap-2 mono text-[10px] text-neutral-500 border border-neutral-300 px-2 py-1 rounded-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                        ACCEPTING_ENGAGEMENTS
                    </div>
                    <a
                        href="https://calendly.com/intellivance/30min"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden md:block mono text-[10px] text-neutral-900 uppercase tracking-wider hover:text-neutral-600 transition-colors font-semibold"
                    >
                        Book a Call
                    </a>
                    <Link href="/assessment" className="btn-tech">
                        <span>Free Assessment</span>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path
                                d="M1 11L11 1M11 1H3M11 1V9"
                                stroke="currentColor"
                                strokeWidth="1"
                            />
                        </svg>
                    </Link>
                </div>
            </nav>

            {/* Client Portal Login Modal */}
            {showLogin && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    onClick={(e) => { if (e.target === e.currentTarget) setShowLogin(false); }}
                >
                    <div className="bg-white border border-neutral-200 w-full max-w-sm mx-4 p-8 shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="60 90 280 340" width="16" height="22">
                                    <rect x="185" y="385" width="30" height="30" rx="4" fill="#1A1A1A" />
                                    <rect x="182" y="345" width="36" height="30" rx="4" fill="#2A2A2A" />
                                    <rect x="179" y="305" width="42" height="30" rx="4" fill="#3A3A3A" />
                                    <rect x="176" y="265" width="48" height="30" rx="4" fill="#4A4A4A" />
                                    <rect x="173" y="225" width="54" height="30" rx="4" fill="#5A5A5A" />
                                    <polygon points="200,110 232,165 168,165" fill="#1A1A1A" />
                                </svg>
                                <span className="mono font-bold text-sm tracking-tight">CLIENT PORTAL</span>
                            </div>
                            <button onClick={() => setShowLogin(false)} className="text-neutral-400 hover:text-black transition-colors text-xl leading-none">&times;</button>
                        </div>
                        <p className="text-sm text-neutral-500 mb-6">Sign in to access your project dashboard, reports, and performance metrics.</p>
                        <form onSubmit={handleLogin}>
                            <div className="mb-4">
                                <label className="mono text-[10px] text-neutral-400 uppercase tracking-widest block mb-1.5">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm focus:outline-none focus:border-neutral-900 transition-colors"
                                    placeholder="you@company.com"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="mono text-[10px] text-neutral-400 uppercase tracking-widest block mb-1.5">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm focus:outline-none focus:border-neutral-900 transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                            {loginError && (
                                <div className="mb-4 text-red-600 text-sm bg-red-50 border border-red-200 px-3 py-2">
                                    Incorrect password. Please try again.
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-neutral-900 text-white py-2.5 mono text-[10px] uppercase tracking-wider hover:bg-black transition-colors disabled:opacity-50"
                            >
                                {isSubmitting ? "Authenticating..." : "Sign In"}
                            </button>
                        </form>
                        <div className="mt-4 text-center">
                            <span className="mono text-[10px] text-neutral-400">Forgot password? Contact your account manager.</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
