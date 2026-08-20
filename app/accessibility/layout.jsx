import { constructMetadata } from "@/lib/metadata";
import { siteConfig } from "@/config/site";

export const metadata = constructMetadata({
  title: "Accessibility Statement — Adesa Energy",
  description:
    "Adesa Energy is committed to making our website accessible to all users. Read our Accessibility Statement and learn how we support all abilities.",
  path: "/accessibility",
  keywords: [
    "Adesa Energy accessibility",
    "website accessibility Nigeria",
    "accessible CNG website",
    "WCAG compliance Adesa",
  ],
});

export default function AccessibilityLayout({ children }) {
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
        name: "Accessibility",
        item: `${siteConfig.url}/accessibility`,
      },
    ],
  };

  return (
    <div>
      <h1 className="sr-only">Accessibility Statement — Adesa Energy</h1>
      <section>{children}</section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </div>
  );
}
