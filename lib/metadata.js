import { siteConfig } from "@/config/site";

export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  noIndex = false,
  path = "",
  keywords = [],
  type = "website",
  datePublished,
  dateModified,
} = {}) {
  const url = new URL(path, siteConfig.url).toString();
  const imageUrl = image.startsWith("/")
    ? `${siteConfig.url.replace(/\/$/, "")}${image}`
    : image;

  const allKeywords = [
    ...new Set([
      "Adesa Energy",
      "CNG conversion Nigeria",
      "mobile CNG refueling",
      "compressed natural gas",
      "fleet fuel solutions",
      "alternative fuel Nigeria",
      "mobile CNG conversion",
      "CNG services Nigeria",
      "vehicle gas conversion",
      "clean energy transport Nigeria",
      "CNG conversion Lagos",
      "CNG refueling Abuja",
      "fuel cost savings Nigeria",
      "CNG vehicle conversion Ilorin",
      ...keywords,
    ]),
  ];

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: title,
      template: `%s | ${siteConfig.name}`,
    },
    description,
    keywords: allKeywords,
    authors: [{ name: "Adesa Energy", url: siteConfig.url }],
    creator: "Adesa Energy",
    publisher: "Adesa Energy",
    category: "Energy & Transportation",
    classification: "Business",
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    openGraph: {
      type,
      locale: "en_NG",
      url,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${title} — Adesa Energy`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      creator: "@adesaenergy",
      site: "@adesaenergy",
    },
    alternates: {
      canonical: url,
      languages: {
        "en-NG": url,
      },
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      nocache: noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
    },
  };
}
