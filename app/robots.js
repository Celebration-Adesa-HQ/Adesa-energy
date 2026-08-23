import { siteConfig } from "@/config/site";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/api/",
      },
      { userAgent: "Googlebot", allow: "/", disallow: "/api/" },
      { userAgent: "Bingbot", allow: "/", disallow: "/api/" },
      { userAgent: "Applebot", allow: "/", disallow: "/api/" },
      { userAgent: "DuckDuckBot", allow: "/", disallow: "/api/" },
      { userAgent: "OAI-SearchBot", allow: "/", disallow: "/api/" },
      { userAgent: "PerplexityBot", allow: "/", disallow: "/api/" },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
