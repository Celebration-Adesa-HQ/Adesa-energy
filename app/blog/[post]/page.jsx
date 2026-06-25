import { siteConfig } from "@/config/site";
import BlogDetailClient from "./_components/BlogDetailClient";
import { notFound } from "next/navigation";

// Dynamic metadata per post
export async function generateMetadata({ params }) {
  const { post } = await params;
  const currentPost = siteConfig?.blog.posts.find((p) => p.slug === post);

  if (!currentPost) {
    return {
      title: "Post Not Found — Adesa Energy Blog",
      description: "The blog post you are looking for does not exist. Browse all CNG articles on the Adesa Energy blog.",
      robots: { index: false, follow: false },
      alternates: {
        canonical: "https://www.adesaenergy.com/blog",
      },
    };
  }

  const ogImageUrl =
    currentPost.ogImage || currentPost.image || "/adesa-energy.png";
  const absoluteOgImageUrl = ogImageUrl.startsWith("/")
    ? `${siteConfig.url.replace(/\/$/, "")}${ogImageUrl}`
    : ogImageUrl;

  return {
    title: currentPost.title,
    description: currentPost.excerpt,
    keywords: [
      "CNG Nigeria",
      "compressed natural gas",
      "fuel savings Nigeria",
      "Adesa Energy",
      currentPost.tag,
      ...(currentPost.tags || []),
    ].filter(Boolean),
    authors: [{ name: "Adesa Energy", url: siteConfig.url }],
    creator: "Adesa Energy",
    alternates: {
      canonical: `${siteConfig.url}/blog/${currentPost.slug}`,
    },
    openGraph: {
      title: currentPost.title,
      description: currentPost.excerpt,
      url: `${siteConfig.url}/blog/${currentPost.slug}`,
      type: "article",
      publishedTime: (() => {
        try {
          const d = new Date(currentPost.date);
          return isNaN(d.getTime()) ? undefined : d.toISOString();
        } catch {
          return undefined;
        }
      })(),
      authors: [`${siteConfig.url}`],
      tags: ["CNG", "Nigeria", "fuel savings", currentPost.tag].filter(Boolean),
      images: [
        {
          url: absoluteOgImageUrl,
          width: 1200,
          height: 630,
          alt: `${currentPost.title} — Adesa Energy Blog`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: currentPost.title,
      description: currentPost.excerpt,
      images: [absoluteOgImageUrl],
      creator: "@adesaenergy",
      site: "@adesaenergy",
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const { post } = await params;

  const currentPost = siteConfig.blog.posts.find((p) => p.slug === post);

  if (!currentPost) {
    return notFound();
  }

  const postImageUrl = currentPost.image
    ? currentPost.image.startsWith("/")
      ? `${siteConfig.url.replace(/\/$/, "")}${currentPost.image}`
      : currentPost.image
    : `${siteConfig.url.replace(/\/$/, "")}/adesa-energy.png`;

  const parseDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) return d.toISOString();
    } catch (e) {}
    return new Date().toISOString();
  };

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${siteConfig.url}/blog/${currentPost.slug}/#article`,
    "headline": currentPost.title,
    "description": currentPost.excerpt,
    "image": {
      "@type": "ImageObject",
      "url": postImageUrl,
      "width": 1200,
      "height": 630,
    },
    "datePublished": parseDate(currentPost.date),
    "dateModified": parseDate(currentPost.date),
    "author": {
      "@type": "Organization",
      "name": "Adesa Energy",
      "url": siteConfig.url,
    },
    "publisher": {
      "@type": "Organization",
      "name": "Adesa Energy",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteConfig.url}/adesa-energy.png`,
        "width": 400,
        "height": 400,
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/blog/${currentPost.slug}`,
    },
    "articleSection": currentPost.tag || "CNG News",
    "keywords": ["CNG Nigeria", "fuel savings", "Adesa Energy", currentPost.tag].filter(Boolean),
    "inLanguage": "en-NG",
    "isPartOf": {
      "@type": "Blog",
      "@id": `${siteConfig.url}/blog/#blog`,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": siteConfig.url },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${siteConfig.url}/blog` },
      { "@type": "ListItem", "position": 3, "name": currentPost.title, "item": `${siteConfig.url}/blog/${currentPost.slug}` },
    ],
  };

  return (
    <>
      <BlogDetailClient currentPost={currentPost} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([blogSchema, breadcrumbSchema]) }}
      />
    </>
  );
}
