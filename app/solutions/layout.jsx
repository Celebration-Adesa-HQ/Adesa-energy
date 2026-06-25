import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "CNG Solutions for Vehicles and Fleets",
  description:
    "Explore Adesa Energy CNG solutions including mobile vehicle conversion and on-demand refueling for fleets and individuals in Nigeria.",
  path: "/solutions",
});

export default function SolutionsLayout({ children }) {
  return (
    <main role="main">
      <h1 className="sr-only">
        Mobile CNG Solutions for Vehicles and Fleets in Nigeria
      </h1>
      <section>{children}</section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "@id": "https://www.adesaenergy.com/solutions/#service",
            "serviceType": "CNG Vehicle Conversion & Refueling Services",
            "provider": {
              "@type": "Organization",
              "name": "Adesa Energy",
            },
            "areaServed": {
              "@type": "Country",
              "name": "Nigeria",
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Adesa CNG Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Mobile CNG Conversion",
                    "description": "Professional CNG conversion services performed directly at your fleet location or our physical centres in Lagos, Ilorin, and Abuja.",
                  },
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "On-demand Mobile Refueling",
                    "description": "24/7 on-demand mobile CNG refueling delivered to vehicle fleets, depots, or residences.",
                  },
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Fleet Conversion Packages",
                    "description": "Customized conversion solutions for logistics, corporate, and transport union fleets with flexible financing options.",
                  },
                },
              ],
            },
          }),
        }}
      />
    </main>
  );
}
