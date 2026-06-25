import { siteConfig } from "@/config/site";

export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  noIndex = false,
  path = "",
  keywords = [],
} = {}) {
  const url = new URL(path, siteConfig.url).toString();
  const imageUrl = image.startsWith("/")
    ? `${siteConfig.url.replace(/\/$/, "")}${image}`
    : image;

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: title,
      template: `%s | ${siteConfig.name}`,
    },
    description,
    keywords: [
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
        ...keywords,
      ]),
    ],
    authors: [{ name: "Adesa Energy" }],
    creator: "Adesa Energy",
    publisher: "Adesa Energy",
    openGraph: {
      type: "website",
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
          alt: "Adesa Energy Mobile CNG Services",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      creator: "@adesaenergy",
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
      },
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
    },
  };
}

