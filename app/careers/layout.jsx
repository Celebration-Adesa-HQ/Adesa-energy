import { constructMetadata } from "@/lib/metadata";
import { siteConfig } from "@/config/site";

export const metadata = constructMetadata({
  title: "Careers at Adesa Energy | Join Our Clean Energy Mission",
  description:
    "Explore career opportunities at Adesa Energy. Join our team of engineers, operators, and sustainability experts building the future of mobile CNG conversion and refueling in Nigeria.",
  path: "/careers",
  keywords: [
    "Adesa Energy careers",
    "clean energy jobs Nigeria",
    "CNG company jobs Lagos",
    "energy startup jobs Nigeria",
    "software engineer Lagos energy",
    "sustainability jobs Nigeria",
    "product designer Lagos",
    "green energy careers Africa",
    "renewable energy jobs Nigeria",
    "Adesa Energy job openings",
  ],
});

export default function CareerLayout({ children }) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteConfig.url,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Careers",
        "item": `${siteConfig.url}/careers`,
      },
    ],
  };

  const jobPostings = siteConfig.careers.jobs.jobListings.map((job) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description,
    "hiringOrganization": {
      "@type": "Organization",
      "name": "Adesa Energy",
      "sameAs": siteConfig.url,
      "logo": `${siteConfig.url}/adesa-energy.png`,
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.location.includes("Remote") ? undefined : job.location,
        "addressCountry": "NG",
      },
    },
    "employmentType": job.type.toUpperCase().replace("-", "_"),
    "jobLocationType": job.location.includes("Remote") ? "TELECOMMUTE" : undefined,
    "applicantLocationRequirements": {
      "@type": "Country",
      "name": "Nigeria",
    },
    "datePosted": job.datePosted,
    "validThrough": job.validThrough,
    "url": `${siteConfig.url}${job.href}`,
    "directApply": true,
  }));

  return (
    <div>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbSchema, ...jobPostings]),
        }}
      />
    </div>
  );
}
