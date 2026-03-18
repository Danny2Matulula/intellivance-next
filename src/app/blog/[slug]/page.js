import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CommentSection from "@/components/CommentSection";
import ShareBar from "@/components/ShareBar";
import ScrollCTA from "@/components/ScrollCTA";
import blogPosts from "@/data/blog-posts.json";

export async function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const post = blogPosts.find((p) => p.slug === slug);
    if (!post) return {};

    return {
        title: post.title,
        description: post.description,
        authors: [{ name: post.author }],
        alternates: {
            canonical: `https://intellivance.ai/blog/${post.slug}`,
        },
        openGraph: {
            type: "article",
            title: post.title,
            description: post.description,
            images: [{ url: "/og-image.png", width: 1200, height: 630, alt: post.title }],
            publishedTime: post.publishedAt,
            modifiedTime: post.modifiedAt,
            authors: [post.author],
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.description,
            images: ["/og-image.png"],
        },
    };
}

// Simple markdown-to-JSX renderer for blog content
function renderMarkdown(content) {
    const lines = content.split("\n");
    const elements = [];
    let inList = false;
    let listItems = [];
    let inTable = false;
    let tableRows = [];
    let inCodeBlock = false;
    let codeLines = [];

    const flushList = () => {
        if (listItems.length > 0) {
            elements.push(
                <ul key={`list-${elements.length}`} className="list-disc pl-6 space-y-1 my-4">
                    {listItems.map((item, i) => (
                        <li key={i} className="text-neutral-700 leading-relaxed">{renderInline(item)}</li>
                    ))}
                </ul>
            );
            listItems = [];
        }
        inList = false;
    };

    const flushTable = () => {
        if (tableRows.length > 0) {
            const headers = tableRows[0];
            const body = tableRows.slice(2); // skip separator row
            elements.push(
                <div key={`table-${elements.length}`} className="overflow-x-auto my-6">
                    <table className="w-full border border-theme text-sm">
                        <thead>
                            <tr className="bg-neutral-100">
                                {headers.map((h, i) => (
                                    <th key={i} className="border border-theme px-4 py-2 text-left mono text-[10px] uppercase tracking-wider text-neutral-500">{h.trim()}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {body.map((row, i) => (
                                <tr key={i} className="hover:bg-[#FAFAF8]">
                                    {row.map((cell, j) => (
                                        <td key={j} className="border border-theme px-4 py-2 text-neutral-700">{cell.trim()}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
            tableRows = [];
        }
        inTable = false;
    };

    const renderInline = (text) => {
        // Handle bold, italic, links, and code
        const parts = [];
        let remaining = text;
        let key = 0;

        while (remaining.length > 0) {
            // Links [text](/url)
            const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);
            // Bold **text**
            const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);
            // Italic *text*
            const italicMatch = remaining.match(/(?<!\*)\*([^*]+)\*(?!\*)/);
            // Inline code `text`
            const codeMatch = remaining.match(/`([^`]+)`/);

            // Find earliest match
            const matches = [
                linkMatch && { type: "link", match: linkMatch, index: remaining.indexOf(linkMatch[0]) },
                boldMatch && { type: "bold", match: boldMatch, index: remaining.indexOf(boldMatch[0]) },
                italicMatch && { type: "italic", match: italicMatch, index: remaining.indexOf(italicMatch[0]) },
                codeMatch && { type: "code", match: codeMatch, index: remaining.indexOf(codeMatch[0]) },
            ].filter(Boolean).sort((a, b) => a.index - b.index);

            if (matches.length === 0) {
                parts.push(remaining);
                break;
            }

            const first = matches[0];
            if (first.index > 0) {
                parts.push(remaining.substring(0, first.index));
            }

            switch (first.type) {
                case "link":
                    parts.push(
                        <Link key={key++} href={first.match[2]} className="text-neutral-900 underline underline-offset-2 hover:text-neutral-600 transition-colors">
                            {first.match[1]}
                        </Link>
                    );
                    break;
                case "bold":
                    parts.push(<strong key={key++} className="font-medium text-neutral-900">{first.match[1]}</strong>);
                    break;
                case "italic":
                    parts.push(<em key={key++} className="italic">{first.match[1]}</em>);
                    break;
                case "code":
                    parts.push(<code key={key++} className="mono text-sm bg-neutral-100 px-1.5 py-0.5 border border-neutral-200">{first.match[1]}</code>);
                    break;
            }

            remaining = remaining.substring(first.index + first.match[0].length);
        }

        return parts;
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Code blocks
        if (line.startsWith("```")) {
            if (inCodeBlock) {
                elements.push(
                    <pre key={`code-${elements.length}`} className="bg-neutral-900 text-neutral-100 p-4 my-4 overflow-x-auto mono text-sm">
                        <code>{codeLines.join("\n")}</code>
                    </pre>
                );
                codeLines = [];
                inCodeBlock = false;
            } else {
                flushList();
                flushTable();
                inCodeBlock = true;
            }
            continue;
        }

        if (inCodeBlock) {
            codeLines.push(line);
            continue;
        }

        // Table rows
        if (line.includes("|") && line.trim().startsWith("|")) {
            if (!inTable) {
                flushList();
                inTable = true;
            }
            const cells = line.split("|").filter((c) => c.trim().length > 0 && !c.match(/^[\s-]+$/));
            if (cells.length > 0 && !line.match(/^\|[\s-|]+\|$/)) {
                tableRows.push(cells);
            } else {
                tableRows.push(null); // separator
            }
            continue;
        } else if (inTable) {
            flushTable();
        }

        // Headers
        if (line.startsWith("### ")) {
            flushList();
            elements.push(
                <h3 key={`h3-${elements.length}`} className="text-xl font-medium mt-10 mb-3">
                    {renderInline(line.replace("### ", ""))}
                </h3>
            );
            continue;
        }
        if (line.startsWith("## ")) {
            flushList();
            elements.push(
                <h2 key={`h2-${elements.length}`} className="text-2xl font-medium mt-12 mb-4">
                    {renderInline(line.replace("## ", ""))}
                </h2>
            );
            continue;
        }

        // Horizontal rule
        if (line === "---") {
            flushList();
            elements.push(
                <hr key={`hr-${elements.length}`} className="border-t border-theme my-10" />
            );
            continue;
        }

        // Numbered lists
        if (line.match(/^\d+\.\s/)) {
            if (!inList) {
                inList = true;
            }
            listItems.push(line.replace(/^\d+\.\s/, ""));
            continue;
        }

        // Bullet lists
        if (line.startsWith("- ")) {
            if (!inList) {
                inList = true;
            }
            listItems.push(line.replace("- ", ""));
            continue;
        }

        // End list if we hit non-list line
        if (inList && line.trim() !== "") {
            flushList();
        }

        // Empty line
        if (line.trim() === "") {
            if (inList) flushList();
            continue;
        }

        // Paragraph
        elements.push(
            <p key={`p-${elements.length}`} className="text-neutral-700 leading-relaxed my-4">
                {renderInline(line)}
            </p>
        );
    }

    flushList();
    flushTable();

    return elements;
}

export default async function BlogPost({ params }) {
    const { slug } = await params;
    const post = blogPosts.find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }

    // Related posts (same category, excluding current)
    const related = blogPosts
        .filter((p) => p.slug !== slug && p.category === post.category)
        .slice(0, 2);

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        author: {
            "@type": "Person",
            name: post.author,
        },
        publisher: {
            "@type": "Organization",
            name: "Intellivance",
            url: "https://intellivance.ai",
        },
        datePublished: post.publishedAt,
        dateModified: post.modifiedAt,
        mainEntityOfPage: `https://intellivance.ai/blog/${post.slug}`,
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://intellivance.ai" },
            { "@type": "ListItem", position: 2, name: "Blog", item: "https://intellivance.ai/blog" },
            { "@type": "ListItem", position: 3, name: post.title, item: `https://intellivance.ai/blog/${post.slug}` },
        ],
    };

    return (
        <div className="selection:bg-neutral-900 selection:text-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />

            <Navbar />

            <main className="pt-16">
                {/* Header */}
                <section className="py-16 px-6 lg:px-12 bg-[#EAEAE5] border-b border-theme">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center gap-3 mb-6">
                            <Link
                                href="/blog"
                                className="mono text-[10px] text-neutral-400 hover:text-black transition-colors tracking-wider"
                            >
                                ← BACK TO BLOG
                            </Link>
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="mono text-[9px] px-2 py-0.5 bg-neutral-100 border border-neutral-200 text-neutral-500">
                                {post.category}
                            </span>
                            <span className="mono text-[9px] text-neutral-400">
                                {post.readingTime}
                            </span>
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-normal tracking-tight mb-4 leading-[1.15]">
                            {post.title}
                        </h1>
                        <p className="text-lg text-neutral-600 leading-relaxed">
                            {post.description}
                        </p>
                        <div className="flex items-center gap-3 mt-6 pt-6 border-t border-theme">
                            <div className="w-8 h-8 bg-neutral-200 border border-neutral-300 flex items-center justify-center text-[10px] font-bold">
                                {post.author
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                            </div>
                            <div>
                                <div className="text-sm font-medium">{post.author}</div>
                                <div className="mono text-[10px] text-neutral-400">
                                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                    {post.modifiedAt !== post.publishedAt && (
                                        <> • Updated {new Date(post.modifiedAt).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })}</>
                                    )}
                                </div>
                            </div>
                            <div className="mt-5">
                                <ShareBar title={post.title} slug={post.slug} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Content */}
                <article className="py-12 px-6 lg:px-12 bg-white">
                    <div className="max-w-3xl mx-auto prose-custom">
                        {renderMarkdown(post.content)}
                    </div>
                </article>

                {/* Share bar after article */}
                <div className="px-6 lg:px-12 py-6 bg-white border-t border-theme">
                    <div className="max-w-3xl mx-auto">
                        <ShareBar title={post.title} slug={post.slug} />
                    </div>
                </div>

                {/* Comments Section */}
                <CommentSection comments={post.comments} />

                {/* Related Posts */}
                {related.length > 0 && (
                    <section className="py-12 px-6 lg:px-12 bg-[#F2F2F0] border-t border-theme">
                        <div className="max-w-3xl mx-auto">
                            <div className="mono text-[10px] text-neutral-400 uppercase tracking-widest mb-6">
                                Related Reading
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {related.map((p) => (
                                    <Link
                                        key={p.slug}
                                        href={`/blog/${p.slug}`}
                                        className="group border border-theme bg-white p-5 hover:border-neutral-900 transition-colors"
                                    >
                                        <div className="font-medium mb-2 group-hover:text-neutral-900 transition-colors leading-tight">
                                            {p.title}
                                        </div>
                                        <div className="text-sm text-neutral-500 line-clamp-2">
                                            {p.description}
                                        </div>
                                        <div className="mono text-[9px] text-neutral-400 mt-3">
                                            {p.readingTime}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Assessment CTA */}
                <section className="py-16 px-6 lg:px-12 bg-neutral-900 text-[#EAEAE5]">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="mono text-[9px] text-neutral-500 uppercase tracking-widest mb-4">
                            FREE — TAKES 3 MINUTES
                        </div>
                        <h2 className="text-2xl font-normal tracking-tight mb-4">
                            Want to know exactly where AI fits in <em>your</em> business?
                        </h2>
                        <p className="text-neutral-400 mb-3 max-w-lg mx-auto leading-relaxed">
                            Take the AI Readiness Assessment — 6 quick questions, instant score across 4 categories, and a personalized PDF report you can share with your team.
                        </p>
                        <p className="text-neutral-500 text-sm mb-8">
                            We&apos;ve automated $4.2M+ in operations across 40+ businesses. 100% client retention.
                        </p>
                        <Link
                            href="/assessment"
                            className="bg-[#EAEAE5] text-neutral-900 px-8 py-4 mono text-xs uppercase tracking-wider hover:bg-white transition-colors inline-flex items-center gap-3"
                        >
                            Get Your AI Readiness Score
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path
                                    d="M1 11L11 1M11 1H3M11 1V9"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                />
                            </svg>
                        </Link>
                        <p className="text-neutral-500 text-sm mt-6">
                            Or reach out directly: <a href="mailto:hello@intellivance.ai" className="text-[#EAEAE5] underline underline-offset-2 hover:text-white transition-colors">hello@intellivance.ai</a>
                        </p>
                    </div>
                </section>
            </main>

            <Footer />
            <ScrollCTA />
        </div>
    );
}
