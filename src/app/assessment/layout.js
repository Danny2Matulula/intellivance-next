export const metadata = {
    title: "Free Operations Assessment",
    description:
        "Take a free 3-minute assessment and receive a custom AI operations roadmap, plus a free SEO and competitor analysis report in 48 hours.",
    alternates: {
        canonical: "https://intellivance.ai/assessment",
    },
    openGraph: {
        type: "website",
        title: "Free Operations Assessment | Intellivance",
        description:
            "Take a free 3-minute assessment and receive a custom AI operations roadmap, plus a free SEO and competitor analysis report in 48 hours.",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Intellivance — Free Operations Assessment",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Free Operations Assessment | Intellivance",
        description:
            "Take a free 3-minute assessment and receive a custom AI operations roadmap, plus a free SEO and competitor analysis report in 48 hours.",
        images: ["/og-image.png"],
    },
};

export default function AssessmentLayout({ children }) {
    return children;
}
