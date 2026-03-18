"use client";

import { useState } from "react";
import Link from "next/link";

const allClients = [
    {
        initials: "AD",
        name: "Auto Dealership Group",
        sub: "4-Location Service Business",
        category: "Operations",
        tag: "service",
        result: "$250K+ in annual time savings",
        desc: "Eliminated 15 hrs/wk of admin across fleet outreach, email triage, and daily reporting.",
    },
    {
        initials: "MS",
        name: "Med Spa & Wellness Chain",
        sub: "Healthcare + Wellness",
        category: "Patient Retention",
        tag: "service",
        result: "Rebookings: 31% → 64%",
        desc: "AI-powered post-visit follow-ups and review requests. Rebooking rate doubled within 6 weeks.",
    },
    {
        initials: "CC",
        name: "Commercial Cleaning Co.",
        sub: "Field Services",
        category: "Scheduling",
        tag: "service",
        result: "40% fewer no-shows",
        desc: "AI-powered scheduling confirmations and route optimization. Crew utilization improved overnight.",
    },
    {
        initials: "DS",
        name: "DTC Supplement Brand",
        sub: "E-Commerce / DTC",
        category: "Revenue",
        tag: "ecommerce",
        result: "+$12K/mo in LTV",
        desc: "Personalized reorder sequences based on purchase history. Subscription retention jumped 34%.",
    },
    {
        initials: "RL",
        name: "Regional Law Firm",
        sub: "Legal Services",
        category: "Intake",
        tag: "professional",
        result: "Intake: 2 days → 20 min",
        desc: "Client intake auto-summarized, conflict-checked, and assigned. What took 2 days now takes 20 minutes.",
    },
    {
        initials: "HV",
        name: "HVAC Service Provider",
        sub: "Home Services",
        category: "Follow-up",
        tag: "service",
        result: "$4K/mo in callbacks recovered",
        desc: "AI-powered service follow-ups and warranty reminders. Revenue that slipped through the cracks now gets captured.",
    },
    {
        initials: "RB",
        name: "Regional E-Commerce Brand",
        sub: "Multi-channel Retail",
        category: "Cart Recovery",
        tag: "ecommerce",
        result: "+$8K/mo recovered",
        desc: "Cart recovery engine with personalized follow-ups sent within 20 minutes of abandonment.",
    },
    {
        initials: "BC",
        name: "Boutique Consulting Firm",
        sub: "Professional Services",
        category: "Proposals",
        tag: "professional",
        result: "3x faster proposals",
        desc: "Intake-to-scope AI: call transcribed, SOW drafted, and pricing pulled from comparable data.",
    },
    {
        initials: "SC",
        name: "B2B SaaS Company",
        sub: "Technology / Software",
        category: "Onboarding",
        tag: "professional",
        result: "Onboarding: 14 days → 3 days",
        desc: "AI-powered customer onboarding sequences — account setup, training emails, and check-in calls triggered automatically based on usage signals.",
    },
    {
        initials: "FA",
        name: "Financial Advisory Firm",
        sub: "Wealth Management",
        category: "Compliance",
        tag: "professional",
        result: "8 hrs/wk freed from reporting",
        desc: "Automated quarterly client reports and compliance document generation. Advisors spend time advising, not formatting PDFs.",
    },
    {
        initials: "MA",
        name: "Digital Marketing Agency",
        sub: "Agency / Professional Services",
        category: "Client Reporting",
        tag: "professional",
        result: "30+ reports/mo on autopilot",
        desc: "AI pulls campaign data from Google, Meta, and email platforms — formats branded client reports and delivers them weekly. Zero analyst hours.",
    },
];

export default function ClientResults() {
    const [activeFilter, setActiveFilter] = useState("all");

    const filteredClients =
        activeFilter === "all"
            ? allClients
            : allClients.filter((c) => c.tag === activeFilter);

    return (
        <section id="proof" className="w-full py-20 px-6 lg:px-12 bg-[#EAEAE5]">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div>
                        <h2 className="text-4xl font-normal tracking-tight mb-2">
                            Client Results
                        </h2>
                        <p className="text-neutral-500 mono text-sm">
                            REAL ENGAGEMENTS • MEASURABLE OUTCOMES • VERIFIED
                        </p>
                    </div>
                    <div className="flex gap-2 mt-6 md:mt-0">
                        {[
                            { key: "all", label: "All" },
                            { key: "service", label: "Service" },
                            { key: "ecommerce", label: "E-Commerce" },
                            { key: "professional", label: "Professional" },
                        ].map((f) => (
                            <button
                                key={f.key}
                                onClick={() => setActiveFilter(f.key)}
                                className={`px-4 py-2 border mono text-xs uppercase transition-colors ${activeFilter === f.key
                                    ? "border-neutral-900 bg-neutral-900 text-white"
                                    : "border-neutral-300 text-neutral-600 hover:border-black"
                                    }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table header */}
                <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1.5fr] gap-4 px-6 py-3 border-b border-black text-[10px] mono uppercase tracking-wider text-neutral-500">
                    <div>Client / Industry</div>
                    <div>Category</div>
                    <div>Key Result</div>
                    <div className="text-right">Action</div>
                </div>

                {/* Table rows */}
                <div className="bg-white border border-theme shadow-sm">
                    {filteredClients.map((client, i) => (
                        <div
                            key={client.initials + i}
                            className="group grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1.5fr] p-4 md:px-6 md:py-5 border-b border-theme items-center hover:bg-[#FAFAF8] transition-colors cursor-pointer last:border-b-0"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-neutral-100 border border-neutral-200 flex items-center justify-center text-[10px] font-bold shrink-0">
                                    {client.initials}
                                </div>
                                <div>
                                    <div className="font-medium text-neutral-900">
                                        {client.name}
                                    </div>
                                    <div className="text-xs text-neutral-500 mono">
                                        {client.sub}
                                    </div>
                                </div>
                            </div>
                            <div className="mono text-xs text-neutral-600 mt-2 md:mt-0">
                                <span className="md:hidden text-neutral-400 mr-2">
                                    CATEGORY:
                                </span>
                                {client.category}
                            </div>
                            <div className="mt-1 md:mt-0">
                                <span className="md:hidden text-neutral-400 mr-2 text-xs mono">
                                    RESULT:
                                </span>
                                <span className="text-lg font-medium tracking-tight">
                                    {client.result}
                                </span>
                            </div>
                            <div className="flex justify-end mt-4 md:mt-0">
                                <Link
                                    href="/assessment"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white px-4 py-2 text-[10px] mono uppercase tracking-wider"
                                >
                                    Get Started
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between items-center mt-4 mono text-xs text-neutral-500">
                    <span>DISPLAYING {filteredClients.length} OF 30+ ENGAGEMENTS</span>
                    {activeFilter !== "all" && (
                        <button
                            onClick={() => setActiveFilter("all")}
                            className="hover:text-black transition-colors flex items-center gap-1"
                        >
                            CLEAR FILTERS ✕
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}
