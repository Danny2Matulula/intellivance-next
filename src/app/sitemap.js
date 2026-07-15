export default function sitemap() {
  const lastModified = new Date("2026-07-14");

  return [
    {
      url: "https://intellivance.ai",
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://intellivance.ai/privacy-policy",
      lastModified,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
