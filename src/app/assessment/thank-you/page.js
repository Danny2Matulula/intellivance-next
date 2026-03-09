"use client";

import { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check, ArrowRight } from "lucide-react";

export default function ThankYouPage() {
    const gadsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
    const conversionLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;

    useEffect(() => {
        // Google Ads Conversion
        if (gadsId && conversionLabel && typeof window !== "undefined" && window.gtag) {
            window.gtag("event", "conversion", {
                send_to: `${gadsId}/${conversionLabel}`,
            });
        }

        // Microsoft Advertising UET Conversion
        if (typeof window !== "undefined") {
            window.uetq = window.uetq || [];
            window.uetq.push("event", "lead", {});
        }
    }, [gadsId, conversionLabel]);

    return (
        <div className="selection:bg-neutral-900 selection:text-white">
            <Navbar />
            <main className="pt-16 min-h-screen flex items-center justify-center px-6 bg-[#EAEAE5] relative overflow-hidden">
                <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none"></div>
                <div className="max-w-2xl w-full relative z-10 py-20">
                    <div className="bg-white border border-theme p-8 lg:p-12 shadow-sm">

                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-[#FAFAF8] border border-theme flex items-center justify-center">
                                <Check className="w-6 h-6 text-neutral-900" />
                            </div>
                            <div>
                                <h1 className="text-3xl tracking-tight font-normal">We&apos;re on it.</h1>
                                <p className="text-[14px] text-neutral-500 mt-1">Your diagnostic has been received.</p>
                            </div>
                        </div>

                        <div className="mono text-[10px] text-neutral-500 uppercase tracking-widest mb-6">What happens next</div>
                        <div className="space-y-0">
                            {[
                                { step: "01", title: "Confirmation email sent", desc: "Check your inbox — you'll receive a confirmation with a summary of your responses.", time: "Now" },
                                { step: "02", title: "Operations analysis begins", desc: "We're running a full analysis of your workflow — identifying bottlenecks, wasted hours, and opportunities to put AI to work.", time: "Within 1 hour" },
                                { step: "03", title: "Custom roadmap delivered", desc: "Your operational roadmap lands in your inbox. It maps exactly where you're losing time and money, with specific solutions.", time: "Within 48 hours" }
                            ].map((item, i) => (
                                <div key={i} className="grid grid-cols-[60px_1fr_auto] gap-6 py-6 border-t border-theme">
                                    <div className="mono text-[10px] text-neutral-400 uppercase tracking-widest pt-1">{item.step}</div>
                                    <div>
                                        <div className="text-[15px] font-medium text-neutral-900 mb-1">{item.title}</div>
                                        <div className="text-[14px] text-neutral-600 leading-relaxed">{item.desc}</div>
                                    </div>
                                    <div className="mono text-[10px] text-neutral-400 uppercase tracking-widest pt-1 text-right">{item.time}</div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 pt-8 border-t border-theme">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-[#FAFAF8] border border-theme flex items-center justify-center shrink-0">
                                    <span className="mono text-[10px] text-neutral-400">IV</span>
                                </div>
                                <div>
                                    <p className="text-[14px] text-neutral-600 leading-relaxed max-w-xl">
                                        &quot;We review every diagnostic personally. Your roadmap won&apos;t be a template — it&apos;ll be built specifically around what you told us. If we see something urgent, we&apos;ll flag it before the 48 hours.&quot;
                                    </p>
                                    <p className="mono text-[10px] text-neutral-500 mt-4 uppercase tracking-widest">— Intellivance Team</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 pt-6 border-t border-theme text-center">
                            <Link
                                href="/blog"
                                className="inline-flex items-center gap-2 mono text-[10px] text-neutral-500 uppercase tracking-widest hover:text-neutral-900 transition-colors"
                            >
                                Read our blog while you wait
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
