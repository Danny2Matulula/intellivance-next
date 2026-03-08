import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
    title: "About",
    description:
        "Intellivance is an AI operations firm that builds smart systems for businesses across 12+ industries. Learn about our team, approach, and mission.",
    alternates: {
        canonical: "https://intellivance.ai/about",
    },
};

export default function AboutPage() {
    return (
        <div className="selection:bg-neutral-900 selection:text-white">
            <Navbar />
            <main className="pt-16">
                {/* Hero */}
                <section className="min-h-[60vh] flex items-center justify-center px-6 lg:px-12 py-24 bg-[#EAEAE5] border-b border-theme relative">
                    <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none"></div>
                    <div className="max-w-3xl text-center relative z-10">
                        <div className="mono text-xs text-neutral-500 mb-6 tracking-widest">
                            [ ABOUT_INTELLIVANCE ]
                        </div>
                        <h1 className="display-text text-neutral-900 reveal-up mb-8" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
                            We build the systems that let operators operate.
                        </h1>
                        <p className="text-lg text-neutral-600 leading-relaxed max-w-xl mx-auto">
                            Intellivance is an AI operations firm. We design,
                            build, and maintain the invisible systems that keep
                            multi-location, multi-vertical businesses running — without
                            the busywork.
                        </p>
                    </div>
                </section>

                {/* Mission */}
                <section className="py-20 px-6 lg:px-12 bg-white border-b border-theme">
                    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
                        <div>
                            <div className="mono text-xs text-neutral-500 mb-4 tracking-widest">
                                [ THESIS ]
                            </div>
                            <h2 className="text-3xl font-normal tracking-tight mb-6">
                                AI isn&apos;t a luxury. It&apos;s how modern businesses run.
                            </h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                Most business owners don&apos;t need another tool — they need systems
                                that stop losing them money. Every missed follow-up, every
                                un-sent invoice reminder, every lead that goes cold overnight is
                                revenue walking out the door.
                            </p>
                            <p className="text-neutral-600 leading-relaxed">
                                We treat these systems like plumbing: invisible when they work, catastrophic when they don&apos;t. Our job is to make sure they always work.
                            </p>
                        </div>
                        <div className="space-y-6">
                            {[
                                {
                                    value: "$4.2M+",
                                    label: "Value Created",
                                    desc: "Across all client engagements to date",
                                },
                                {
                                    value: "100%",
                                    label: "Client Retention",
                                    desc: "Every client renews. That's the metric.",
                                },
                                {
                                    value: "11.2 hrs",
                                    label: "Avg. Weekly Recovery",
                                    desc: "Time given back to operators per engagement",
                                },
                            ].map((stat, i) => (
                                <div key={i} className="border border-theme p-6 bg-[#F2F2F0]">
                                    <div className="text-2xl font-medium tracking-tight mb-1">
                                        {stat.value}
                                    </div>
                                    <div className="mono text-[10px] text-neutral-500 uppercase tracking-wider">
                                        {stat.label}
                                    </div>
                                    <p className="text-sm text-neutral-600 mt-2">{stat.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team */}
                <section className="py-20 px-6 lg:px-12 bg-[#EAEAE5] border-b border-theme">
                    <div className="max-w-5xl mx-auto">
                        <div className="mono text-xs text-neutral-500 mb-4 tracking-widest">
                            [ TEAM ]
                        </div>
                        <h2 className="text-3xl font-normal tracking-tight mb-12">
                            Built by operators, for operators.
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                {
                                    initials: "DM",
                                    name: "D. Matulula",
                                    role: "Founder",
                                    desc: "Former lead at an 8-figure software firm. Obsessed with eliminating the gap between what software can do and what businesses actually use it for.",
                                },
                                {
                                    initials: "KM",
                                    name: "K. Maheshwari",
                                    role: "Principal Engineer",
                                    desc: "Former data engineering lead at a Fortune 500 healthcare group. Designed the core architecture behind Intellivance's AI systems and predictive ROI models. Turns messy operational data into production-grade pipelines.",
                                },
                                {
                                    initials: "TS",
                                    name: "T. Seton",
                                    role: "Lead Solutions Architect",
                                    desc: "8 years designing revenue operations systems for high-growth SaaS and professional services firms. Maps every client engagement from initial audit through deployment, translating business problems into technical solutions.",
                                },
                                {
                                    initials: "MF",
                                    name: "M. Foster",
                                    role: "Co-Founder & VP of Engineering",
                                    desc: "Full-stack engineer with deep roots in API integration and workflow orchestration. Previously built internal tooling at a Series B fintech. Architects every AI-powered pipeline Intellivance ships.",
                                },
                                {
                                    initials: "RO",
                                    name: "R. Owens",
                                    role: "Senior Client Strategist",
                                    desc: "8 years managing complex client portfolios across SaaS and professional services. Owns every engagement from kickoff to results review — translating business goals into project scopes and making sure nothing falls through the cracks.",
                                },
                                {
                                    initials: "NC",
                                    name: "N. Chandra",
                                    role: "Implementation Architect",
                                    desc: "Former integration engineer at a mid-market ERP firm. Specializes in connecting the tools businesses already use — CRMs, invoicing platforms, scheduling systems — into unified AI-powered workflows. Handles every deployment end-to-end.",
                                },
                            ].map((member, i) => (
                                <div key={i} className="border border-theme bg-white p-6">
                                    <div className="w-12 h-12 bg-neutral-100 border border-neutral-200 flex items-center justify-center text-sm font-bold mb-4">
                                        {member.initials}
                                    </div>
                                    <div className="font-medium mb-1">{member.name}</div>
                                    <div className="mono text-[10px] text-neutral-500 uppercase tracking-wider mb-3">
                                        {member.role}
                                    </div>
                                    <p className="text-sm text-neutral-600 leading-relaxed">
                                        {member.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-24 px-6 lg:px-12 bg-neutral-900 text-[#EAEAE5]">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-4xl font-normal tracking-tight mb-6 leading-[1.1]">
                            Ready to see what AI can do
                            <br />
                            for your business?
                        </h2>
                        <p className="text-neutral-400 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
                            Start with a free assessment. No call, no credit card. Just a
                            48-hour custom roadmap.
                        </p>
                        <Link
                            href="/assessment"
                            className="bg-[#EAEAE5] text-neutral-900 px-8 py-4 mono text-xs uppercase tracking-wider hover:bg-white transition-colors inline-flex items-center gap-3"
                        >
                            Start Your Free Assessment
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path
                                    d="M1 11L11 1M11 1H3M11 1V9"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                />
                            </svg>
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
