import blogPosts from "@/data/blog-posts.json";

export default function sitemap() {
    const baseUrl = "https://intellivance.ai";

    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date("2026-03-05"),
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date("2026-03-01"),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/assessment`,
            lastModified: new Date("2026-03-05"),
            changeFrequency: "monthly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date("2026-03-05"),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/privacy-policy`,
            lastModified: new Date("2026-03-05"),
            changeFrequency: "yearly",
            priority: 0.3,
        },
    ];

    const blogPages = blogPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.modifiedAt),
        changeFrequency: "monthly",
        priority: 0.7,
    }));

    return [...staticPages, ...blogPages];
}
