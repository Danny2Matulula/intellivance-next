import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://intellivance.ai"),
  title: {
    default: "Intellivance — AI-Powered Operations & Strategic Advisory",
    template: "%s | Intellivance",
  },
  description:
    "We build AI-powered systems that run your business behind the scenes. Get a free operations roadmap in 48 hours — what to fix, in what order, what it saves you.",
  keywords: [
    "AI operations",
    "AI consulting",
    "AI business consulting",
    "operational efficiency",
    "AI-powered operations",
    "strategic advisory",
    "business intelligence",
  ],
  authors: [{ name: "Intellivance" }],
  creator: "Intellivance",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://intellivance.ai",
    siteName: "Intellivance",
    title: "Intellivance — AI-Powered Operations & Strategic Advisory",
    description:
      "We build AI-powered systems that run your business behind the scenes. Focus on what actually grows the business.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Intellivance — AI-Powered Operations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Intellivance — AI-Powered Operations & Strategic Advisory",
    description:
      "We build AI-powered systems that run your business behind the scenes.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://intellivance.ai",
  },
};

// Organization JSON-LD Schema
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Intellivance",
  url: "https://intellivance.ai",
  logo: "https://intellivance.ai/logo.png",
  description:
    "AI-powered operations and strategic advisory for businesses across 12+ industries.",
  foundingDate: "2024",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    url: "https://intellivance.ai/assessment",
  },
  sameAs: [
    "https://linkedin.com/company/intellivance",
  ],
  areaServed: "US",
  serviceType: [
    "AI Operations",
    "AI Consulting",
    "AI Business Consulting",
    "Strategic Advisory",
  ],
};

// WebSite JSON-LD Schema (enables sitelinks search box)
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Intellivance",
  url: "https://intellivance.ai",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://intellivance.ai/blog?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }) {
  const gadsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

  return (
    <html lang="en">
      <head>
        {/* Google Ads Tag (gtag.js) */}
        {gadsId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gadsId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gadsId}');
                `,
              }}
            />
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
