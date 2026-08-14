import { constructMetadata } from "@/lib/metadata";
import { siteConfig } from "@/config/site";

export const metadata = constructMetadata({
  title: "Privacy Policy — Adesa Energy",
  description:
    "Read Adesa Energy's Privacy Policy to understand how we collect, use, and protect your personal information when you use our services.",
  path: "/privacy-policy",
  keywords: [
    "Adesa Energy privacy policy",
    "data protection Nigeria",
    "CNG company privacy",
    "personal data Adesa Energy",
  ],
});

export default function PrivacyPolicyLayout({ children }) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Privacy Policy",
        item: `${siteConfig.url}/privacy-policy`,
      },
    ],
  };

  return (
    <main role="main">
      <h1 className="sr-only">Privacy Policy — Adesa Energy</h1>
      <section>{children}</section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </main>
  );
}
