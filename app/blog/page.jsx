import BlogSection from "@/components/Sections/BlogSection";
import LiveNewsSection from "@/components/Sections/LiveNewsSection";
import { getPosts } from "@/lib/posts";
import { getNigeriaEnergyNews } from "@/lib/news";

export const metadata = {
  title: "Adesa Energy Blog",
  description:
    "Insights on CNG conversion, fuel savings, and transport efficiency.",
  alternates: {
    canonical: "https://www.adesaenergy.com/blog",
  },
};

export default async function BlogPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams?.page || 1);
  const tag = resolvedSearchParams?.tag || null;

  const [{ posts }, liveNews] = await Promise.all([
    getPosts({ page, tag }),
    getNigeriaEnergyNews({ limit: 9 }),
  ]);

  return (
    <div className="min-w-0">
      <LiveNewsSection
        articles={liveNews.articles}
        unavailable={liveNews.unavailable}
        variant="page"
      />
      <BlogSection editorialPosts={posts} variant="page" />
    </div>
  );
}
