import { siteConfig } from "@/config/site";
import BlogDetailClient from "./_components/BlogDetailClient";
import { notFound } from "next/navigation";

// Dynamic metadata per post
export async function generateMetadata({ params }) {
  const { post } = await params;
  const currentPost = siteConfig?.blog.posts.find((p) => p.slug === post);

  if (!currentPost) {
    return {
      title: "Post Not Found - Adesa Energy Blog",
      description: "The post you are looking for does not exist.",
      alternates: {
        canonical: "https://www.adesaenergy.com/blog",
      },
    };
  }

  const ogImageUrl =
    currentPost.ogImage || currentPost.image || "/images/default-og.jpg";

  return {
    title: currentPost.title,
    description: currentPost.excerpt,
    alternates: {
      canonical: `https://www.adesaenergy.com/blog/${currentPost.slug}`,
    },
    openGraph: {
      title: currentPost.title,
      description: currentPost.excerpt,
      url: `https://www.adesaenergy.com/blog/${currentPost.slug}`,
      type: "article",
      images: [ogImageUrl],
    },
    twitter: {
      card: "summary_large_image",
      title: currentPost.title,
      description: currentPost.excerpt,
      images: [ogImageUrl],
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
    "headline": currentPost.title,
    "description": currentPost.excerpt,
    "image": postImageUrl,
    "datePublished": parseDate(currentPost.date),
    "author": {
      "@type": "Organization",
      "name": "Adesa Energy",
      "url": "https://www.adesaenergy.com",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Adesa Energy",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.adesaenergy.com/adesa-energy.png",
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteConfig.url.replace(/\/$/, "")}/blog/${currentPost.slug}`,
    },
  };

  return (
    <>
      <BlogDetailClient currentPost={currentPost} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
    </>
  );
}
