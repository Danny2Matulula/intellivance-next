import { DM_Sans, Sora } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://intellivance.ai"),
  title: {
    default: "Intellivance — Operating Partner for Growth & Transformation",
    template: "%s | Intellivance",
  },
  description:
    "Intellivance helps leaders redesign revenue, operations, and technology into an executable operating system for growth.",
  keywords: [
    "operating partner",
    "business transformation",
    "revenue operations",
    "growth strategy",
    "AI enablement",
    "operating systems",
  ],
  authors: [{ name: "Intellivance" }],
  creator: "Intellivance",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://intellivance.ai",
    siteName: "Intellivance",
    title: "Intellivance — Build the operating system behind growth",
    description:
      "Strategy, systems, and hands-on execution for businesses in motion.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Intellivance — Build the operating system behind growth" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Intellivance — Build the operating system behind growth",
    description:
      "Strategy, systems, and hands-on execution for businesses in motion.",
    images: ["/opengraph-image"],
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
  alternates: { canonical: "https://intellivance.ai" },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Intellivance",
  url: "https://intellivance.ai",
  email: "hello@intellivance.ai",
  description:
    "An operating partner helping businesses strengthen revenue, operations, and technology through strategy, systems, and hands-on execution.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: "hello@intellivance.ai",
    url: "https://intellivance.ai/contact",
  },
  sameAs: ["https://www.linkedin.com/company/intellivance-ai/"],
  areaServed: "US",
  serviceType: [
    "Revenue and Growth Strategy",
    "Business Operations Transformation",
    "AI and Technology Enablement",
    "Embedded Operating Leadership",
  ],
};

export default function RootLayout({ children }) {
  const gadsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const ga4Id = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
  const bingUetId = process.env.NEXT_PUBLIC_BING_UET_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
  const gtagLoadId = ga4Id || gadsId;

  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      </head>
      <body className={`${dmSans.variable} ${sora.variable}`}>
        {children}
        {gtagLoadId ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gtagLoadId}`} strategy="afterInteractive" />
            <Script id="gtag-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());${ga4Id ? `gtag('config','${ga4Id}');` : ""}${gadsId ? `gtag('config','${gadsId}');` : ""}` }} />
          </>
        ) : null}
        {bingUetId ? <Script id="uet-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `(function(w,d,t,u,o){w[u]=w[u]||[],o.ts=(new Date).getTime();var n=d.createElement(t);n.src="https://bat.bing.net/bat.js?ti="+o.ti+("uetq"!=u?"&q="+u:""),n.async=1,n.onload=n.onreadystatechange=function(){var s=this.readyState;s&&"loaded"!==s&&"complete"!==s||(o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad"),n.onload=n.onreadystatechange=null)};var i=d.getElementsByTagName(t)[0];i.parentNode.insertBefore(n,i)})(window,document,"script","uetq",{ti:"${bingUetId}",enableAutoSpaTracking:true});` }} /> : null}
        {clarityId ? <Script id="clarity-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","${clarityId}");` }} /> : null}
      </body>
    </html>
  );
}
