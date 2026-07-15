import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
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
    default: "Intellivance — Custom Software Solutions",
    template: "%s | Intellivance",
  },
  description:
    "Custom web applications, internal tools, client portals, integrations, and software modernization built around the way your business works.",
  keywords: [
    "custom software development",
    "web application development",
    "internal tools",
    "client portals",
    "software integration",
    "software modernization",
  ],
  authors: [{ name: "Intellivance" }],
  creator: "Intellivance",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://intellivance.ai",
    siteName: "Intellivance",
    title: "Intellivance — Custom Software Solutions",
    description:
      "Software built around your business—not the other way around.",
  },
  twitter: {
    card: "summary",
    title: "Intellivance — Custom Software Solutions",
    description:
      "Custom software for work that does not fit in a box.",
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

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Intellivance",
  url: "https://intellivance.ai",
  email: "hello@intellivance.ai",
  description:
    "A custom software company designing and building web applications, internal tools, portals, integrations, and modern software systems.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: "hello@intellivance.ai",
    url: "https://intellivance.ai/#contact",
  },
  sameAs: ["https://www.linkedin.com/company/intellivance-ai/"],
  areaServed: "US",
  serviceType: [
    "Custom Software Development",
    "Web Application Development",
    "Internal Tools",
    "Software Integration",
    "Software Modernization",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Intellivance",
  url: "https://intellivance.ai",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        {children}

        {gtagLoadId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gtagLoadId}`}
              strategy="afterInteractive"
            />
            <Script
              id="gtag-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  ${ga4Id ? `gtag('config', '${ga4Id}');` : ""}
                  ${gadsId ? `gtag('config', '${gadsId}');` : ""}
                `,
              }}
            />
          </>
        ) : null}

        {bingUetId ? (
          <Script
            id="uet-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,t,u,o){w[u]=w[u]||[],o.ts=(new Date).getTime();var n=d.createElement(t);n.src="https://bat.bing.net/bat.js?ti="+o.ti+("uetq"!=u?"&q="+u:""),n.async=1,n.onload=n.onreadystatechange=function(){var s=this.readyState;s&&"loaded"!==s&&"complete"!==s||(o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad"),n.onload=n.onreadystatechange=null)};var i=d.getElementsByTagName(t)[0];i.parentNode.insertBefore(n,i)})(window,document,"script","uetq",{ti:"${bingUetId}",enableAutoSpaTracking:true});`,
            }}
          />
        ) : null}

        {clarityId ? (
          <Script
            id="clarity-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","${clarityId}");`,
            }}
          />
        ) : null}
      </body>
    </html>
  );
}
