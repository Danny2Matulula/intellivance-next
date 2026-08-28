export default function sitemap() {
  const lastModified = new Date("2026-08-28");
  return [
    ["", "weekly", 1],
    ["/practices", "monthly", 0.9],
    ["/approach", "monthly", 0.8],
    ["/about", "monthly", 0.7],
    ["/contact", "monthly", 0.8],
    ["/privacy-policy", "yearly", 0.2],
  ].map(([path, changeFrequency, priority]) => ({ url: `https://intellivance.ai${path}`, lastModified, changeFrequency, priority }));
}
