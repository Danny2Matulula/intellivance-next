"use client";
import { useState } from "react";
import Link from "next/link";

export default function BlogFilter({ posts }) {
    const [active, setActive] = useState("All");

    // Extract unique categories
    const categories = ["All", ...new Set(posts.map((p) => p.category))];

    const filtered = active === "All" ? posts : posts.filter((p) => p.category === active);

    return (
        <>
            {/* Filter Bar */}
            <div className="flex flex-wrap gap-2 mb-8">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActive(cat)}
                        className={`mono text-[10px] px-3 py-1.5 border tracking-wider transition-all duration-200 ${active === cat
                                ? "bg-neutral-900 text-[#EAEAE5] border-neutral-900"
                                : "bg-transparent text-neutral-500 border-neutral-300 hover:border-neutral-900 hover:text-neutral-900"
                            }`}
                    >
                        {cat.toUpperCase()}
                        <span className="ml-1.5 text-[9px] opacity-60">
                            {cat === "All"
                                ? posts.length
                                : posts.filter((p) => p.category === cat).length}
                        </span>
                    </button>
                ))}
            </div>

            {/* Post List */}
            <div className="bg-white border border-theme">
                {filtered.map((post, i) => (
                    <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className={`group grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] p-5 md:px-6 md:py-5 items-center hover:bg-[#FAFAF8] transition-colors ${i < filtered.length - 1 ? "border-b border-theme" : ""
                            }`}
                    >
                        <div>
                            <div className="font-medium group-hover:text-neutral-900 transition-colors">
                                {post.title}
                            </div>
                            <div className="text-sm text-neutral-500 mt-1 line-clamp-1">
                                {post.description}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2 md:mt-0">
                            <span className="mono text-[9px] px-2 py-0.5 bg-neutral-100 border border-neutral-200 text-neutral-500">
                                {post.category}
                            </span>
                            <span className="mono text-[9px] text-neutral-400">
                                {post.readingTime}
                            </span>
                        </div>
                        <div className="mono text-[10px] text-neutral-400 mt-2 md:mt-0 md:text-right">
                            {new Date(post.publishedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </div>
                    </Link>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-12 text-neutral-400 mono text-sm">
                    No posts in this category yet.
                </div>
            )}
        </>
    );
}
