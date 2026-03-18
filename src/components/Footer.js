"use client";

import { useState } from "react";
import Link from "next/link";

export default function Footer() {
    const [email, setEmail] = useState("");
    const [subscribeStatus, setSubscribeStatus] = useState("idle");
    const [subscribeError, setSubscribeError] = useState("");

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email || !email.includes("@") || !email.includes(".")) {
            setSubscribeError("Enter a valid email address.");
            setSubscribeStatus("error");
            return;
        }
        setSubscribeStatus("loading");
        setSubscribeError("");
        try {
            const res = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            if (res.ok) {
                setSubscribeStatus("success");
                setEmail("");
            } else {
                const data = await res.json();
                setSubscribeError(data.error || "Something went wrong.");
                setSubscribeStatus("error");
            }
        } catch (err) {
            setSubscribeError("Network error. Try again.");
            setSubscribeStatus("error");
        }
    };

    return (
        <footer className="bg-white border-t border-theme pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-24">
                    <div className="max-w-md">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-4 h-4 bg-neutral-900"></div>
                            <span className="mono font-bold tracking-tight text-lg">
                                INTELLIVANCE
                            </span>
                        </div>
                        <p className="text-neutral-600 leading-relaxed mb-4">
                            We build AI-powered systems for businesses that want to run smarter.
                            Remove yourself as the bottleneck.
                        </p>
                        <a
                            href="mailto:hello@intellivance.ai"
                            className="block text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-6 mono"
                        >
                            hello@intellivance.ai
                        </a>
                        {subscribeStatus === "success" ? (
                            <div className="border border-green-600 bg-green-50 px-4 py-3 mono text-xs text-green-800 flex items-center gap-2">
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 14 14"
                                    fill="none"
                                >
                                    <path
                                        d="M2 7L5.5 10.5L12 3.5"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    />
                                </svg>
                                You're in. We'll send you the good stuff.
                            </div>
                        ) : (
                            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setSubscribeStatus("idle");
                                            setSubscribeError("");
                                        }}
                                        placeholder="Enter email for updates"
                                        className="border border-theme px-4 py-2 mono text-xs bg-transparent flex-1 focus:outline-none focus:border-neutral-900 transition-colors"
                                        disabled={subscribeStatus === "loading"}
                                    />
                                    <button
                                        type="submit"
                                        disabled={subscribeStatus === "loading"}
                                        className="bg-neutral-900 text-white px-4 py-2 mono text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {subscribeStatus === "loading" ? "Sending..." : "Subscribe"}
                                    </button>
                                </div>
                                {subscribeStatus === "error" && (
                                    <div className="mono text-[10px] text-red-600">
                                        {subscribeError}
                                    </div>
                                )}
                            </form>
                        )}
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                        <div>
                            <div className="mono text-[10px] text-neutral-400 uppercase tracking-widest mb-4">
                                Services
                            </div>
                            <div className="space-y-3">
                                {[
                                    { label: "AI Ops Audit", href: "/assessment" },
                                    { label: "Workflow Design", href: "/assessment" },
                                    { label: "System Build", href: "/assessment" },
                                    { label: "Ongoing Support", href: "/assessment" },
                                ].map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.href}
                                        className="block text-sm text-neutral-600 hover:text-black transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className="mono text-[10px] text-neutral-400 uppercase tracking-widest mb-4">
                                Resources
                            </div>
                            <div className="space-y-3">
                                <Link
                                    href="/blog"
                                    className="block text-sm text-neutral-600 hover:text-black transition-colors"
                                >
                                    Case Studies
                                </Link>
                                <Link
                                    href="/assessment"
                                    className="block text-sm text-neutral-600 hover:text-black transition-colors"
                                >
                                    Free Assessment
                                </Link>
                                <Link
                                    href="/blog"
                                    className="block text-sm text-neutral-600 hover:text-black transition-colors"
                                >
                                    Blog
                                </Link>
                                <Link
                                    href="/about"
                                    className="block text-sm text-neutral-600 hover:text-black transition-colors"
                                >
                                    About Us
                                </Link>
                            </div>
                        </div>
                        <div>
                            <div className="mono text-[10px] text-neutral-400 uppercase tracking-widest mb-4">
                                Legal
                            </div>
                            <div className="space-y-3">
                                <Link
                                    href="/privacy-policy"
                                    className="block text-sm text-neutral-600 hover:text-black transition-colors"
                                >
                                    Terms of Service
                                </Link>
                                <Link
                                    href="/privacy-policy"
                                    className="block text-sm text-neutral-600 hover:text-black transition-colors"
                                >
                                    Privacy Policy
                                </Link>
                                <Link
                                    href="/privacy-policy"
                                    className="block text-sm text-neutral-600 hover:text-black transition-colors"
                                >
                                    Cookie Policy
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-theme">
                    <div className="mono text-xs text-neutral-400">
                        © 2026 INTELLIVANCE. ALL RIGHTS RESERVED.
                    </div>
                    <div className="flex items-center gap-6 mt-4 md:mt-0">
                        <a
                            href="mailto:hello@intellivance.ai"
                            className="mono text-xs text-neutral-400 hover:text-neutral-900 transition-colors"
                        >
                            hello@intellivance.ai
                        </a>
                        <a
                            href="https://calendly.com/dan-intellivance/30min"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mono text-xs text-neutral-400 hover:text-neutral-900 transition-colors"
                        >
                            Book a Call
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
