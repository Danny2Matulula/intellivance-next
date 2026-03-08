import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogFilter from "@/components/BlogFilter";
import blogPosts from "@/data/blog-posts.json";

export const metadata = {
    title: "Blog",
    description:
        "Insights on AI-powered operations, operational efficiency, and business intelligence from the Intellivance team. Case studies, ROI breakdowns, and actionable playbooks.",
    alternates: {
        canonical: "https://intellivance.ai/blog",
    },
};

// CollectionPage schema for blog index
const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Operations Intelligence Blog",
    description:
        "Insights on AI-powered operations, operational efficiency, and business intelligence from the Intellivance team.",
    url: "https://intellivance.ai/blog",
    isPartOf: {
        "@type": "WebSite",
        name: "Intellivance",
        url: "https://intellivance.ai",
    },
};

export default function BlogIndex() {
    const featured = blogPosts.filter((p) => p.featured);

    return (
        <div className="selection:bg-neutral-900 selection:text-white">
            <Navbar />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
            />
            <main className="pt-16">
                {/* Header */}
                <section className="py-20 px-6 lg:px-12 bg-[#EAEAE5] border-b border-theme">
                    <div className="max-w-5xl mx-auto">
                        <div className="mono text-xs text-neutral-500 mb-4 tracking-widest">
                            [ INTEL_FEED ]
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-normal tracking-tight mb-4">
                            Operations intelligence
                        </h1>
                        <p className="text-lg text-neutral-600 max-w-2xl">
                            Case studies, ROI breakdowns, and operational playbooks from 30+
                            engagements across 12 industries.
                        </p>
                    </div>
                </section>

                {/* Featured */}
                {featured.length > 0 && (
                    <section className="py-16 px-6 lg:px-12 bg-white border-b border-theme">
                        <div className="max-w-5xl mx-auto">
                            <div className="mono text-[10px] text-neutral-400 uppercase tracking-widest mb-8">
                                Featured
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {featured.map((post) => (
                                    <Link
                                        key={post.slug}
                                        href={`/blog/${post.slug}`}
                                        className="group border border-theme p-6 hover:border-neutral-900 transition-colors bg-[#FAFAF8]"
                                    >
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="mono text-[9px] px-2 py-0.5 bg-neutral-100 border border-neutral-200 text-neutral-500">
                                                {post.category}
                                            </span>
                                            <span className="mono text-[9px] text-neutral-400">
                                                {post.readingTime}
                                            </span>
                                        </div>
                                        <h2 className="text-lg font-medium mb-2 group-hover:text-neutral-900 transition-colors leading-tight">
                                            {post.title}
                                        </h2>
                                        <p className="text-sm text-neutral-600 leading-relaxed line-clamp-3">
                                            {post.description}
                                        </p>
                                        <div className="mt-4 mono text-[10px] text-neutral-400">
                                            {new Date(post.publishedAt).toLocaleDateString("en-US", {
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* All Posts with Category Filter */}
                <section className="py-16 px-6 lg:px-12 bg-[#EAEAE5]">
                    <div className="max-w-5xl mx-auto">
                        <div className="mono text-[10px] text-neutral-400 uppercase tracking-widest mb-6">
                            All Posts
                        </div>
                        <BlogFilter posts={blogPosts} />
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 px-6 lg:px-12 bg-neutral-900 text-[#EAEAE5]">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-normal tracking-tight mb-4">
                            Stop reading about AI.
                            <br />
                            Start putting it to work.
                        </h2>
                        <p className="text-neutral-400 mb-8">
                            Free assessment. No call. Custom roadmap in 48 hours.
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
