import { constructMetadata } from "@/lib/metadata";
import { siteConfig } from "@/config/site";

export const metadata = constructMetadata({
  title: "Terms & Conditions — Adesa Energy",
  description:
    "Review Adesa Energy's Terms and Conditions governing the use of our website, CNG conversion services, and refueling solutions across Nigeria.",
  path: "/terms",
  keywords: [
    "Adesa Energy terms and conditions",
    "CNG service terms Nigeria",
    "terms of service Adesa",
    "user agreement Adesa Energy",
  ],
});

export default function TermsLayout({ children }) {
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
        name: "Terms & Conditions",
        item: `${siteConfig.url}/terms`,
      },
    ],
  };

  return (
    <div>
      <h1 className="sr-only">Terms & Conditions — Adesa Energy</h1>
      <section>{children}</section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </div>
  );
}
