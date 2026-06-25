export default function robots() {
  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/_next/", "/private/"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/api/", "/_next/", "/private/"],
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/private/"],
        crawlDelay: 10,
      },
    ],
    sitemap: "https://www.adesaenergy.com/sitemap.xml",
    host: "https://www.adesaenergy.com",
  };
}
