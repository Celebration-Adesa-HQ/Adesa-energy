"use client";

import { ArrowRight, BookOpen, Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { usePathname, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import Image from "next/image";

const POSTS_PER_PAGE = 8;

const BlogSection = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isBlogPage = pathname === "/blog";
  const isHome = !isBlogPage;

  const { section, posts } = siteConfig.blog;

  const featuredPost = isBlogPage ? posts[0] : null;
  const restPosts = isBlogPage ? posts.slice(1) : posts;

  const tags = useMemo(
    () => ["All", ...new Set(posts.map((p) => p.tag))],
    [posts],
  );

  const [activeTag, setActiveTag] = useState("All");
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  const filteredPosts = useMemo(() => {
    if (activeTag === "All") return restPosts;
    return restPosts.filter((p) => p.tag === activeTag);
  }, [activeTag, restPosts]);

  const visiblePosts = isBlogPage
    ? filteredPosts.slice(0, visibleCount)
    : posts.slice(0, 3);

  const renderPostImage = (post) => {
    if (post.image) {
      return (
        <Image
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          width={400}
          height={300}
          priority={false}
        />
      );
    } else if (post.icon) {
      const Icon = siteConfig.icons?.[post.icon] || BookOpen;
      return <Icon className={`w-10 h-10 ${post.iconColor || "text-white"}`} />;
    }
    return <BookOpen className="w-10 h-10 text-white/70" />;
  };

  return (
    <section
      id={section.id}
      className={`bg-white dark:bg-[#081126] transition-colors relative overflow-hidden ${
        isBlogPage ? "py-12 sm:py-16 min-h-screen" : "py-20 lg:py-28"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`flex flex-col gap-4 ${
            isBlogPage
              ? "mb-12 max-w-3xl"
              : "md:flex-row md:items-end md:justify-between mb-16"
          }`}
        >
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-burnt-orange/10 border border-burnt-orange/20 text-burnt-orange font-semibold text-xs uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{section.eyebrow}</span>
            </div>
            <h2
              className={`font-heading font-bold text-slate-900 dark:text-white tracking-tight ${
                isBlogPage
                  ? "text-3xl sm:text-4xl lg:text-5xl"
                  : "text-3xl sm:text-4xl lg:text-5xl"
              }`}
            >
              {section.title}
            </h2>
          </div>

          {isHome && (
            <button
              onClick={() => router.push("/blog")}
              className="inline-flex items-center gap-2 text-burnt-orange font-heading font-bold hover:text-[#d15e15] transition-colors cursor-pointer self-start md:self-auto"
            >
              <span>{section.cta.label}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Featured post banner on /blog */}
        {isBlogPage && featuredPost && (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => router.push(`/blog/${featuredPost.slug}`)}
            className="cursor-pointer mb-16 grid md:grid-cols-2 gap-8 rounded-3xl border border-slate-200/80 dark:border-white/10 overflow-hidden bg-slate-50 dark:bg-[#0E1A38] shadow-sm hover:shadow-2xl transition-all duration-300 group"
          >
            <div
              className={`min-h-[280px] bg-linear-to-br ${featuredPost.gradient} flex items-center justify-center relative overflow-hidden`}
            >
              {renderPostImage(featuredPost)}
            </div>

            <div className="p-7 sm:p-10 flex flex-col justify-center space-y-4">
              <div className="flex items-center gap-3 text-xs">
                <span
                  className={`inline-block px-3 py-1 rounded-full font-semibold ${featuredPost.tagStyle}`}
                >
                  {featuredPost.tag}
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {featuredPost.date}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 dark:text-white leading-tight group-hover:text-burnt-orange transition-colors">
                {featuredPost.title}
              </h3>

              <p className="text-slate-600 dark:text-slate-300 font-sans text-sm sm:text-base leading-relaxed line-clamp-3">
                {featuredPost.excerpt}
              </p>

              <div className="pt-2">
                <span className="text-burnt-orange font-heading font-bold text-sm inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  Read article
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </motion.article>
        )}

        {/* Tag filter pills on /blog */}
        {isBlogPage && (
          <div className="flex flex-wrap gap-2.5 mb-12">
            {tags.map((tag) => {
              const isActive = activeTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => {
                    setActiveTag(tag);
                    setVisibleCount(POSTS_PER_PAGE);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-burnt-orange text-white shadow-md shadow-orange-500/20"
                      : "bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        )}

        {/* Blog Post Cards Grid */}
        <div
          className={`grid gap-6 lg:gap-8 ${
            isBlogPage
              ? "sm:grid-cols-2 lg:grid-cols-3"
              : "md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {visiblePosts.map((post, index) => (
            <motion.article
              key={post.slug || index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              onClick={() => router.push(`/blog/${post.slug}`)}
              className="bg-slate-50 dark:bg-[#0E1A38] rounded-3xl overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div
                  className={`h-48 bg-linear-to-br ${post.gradient} flex items-center justify-center relative overflow-hidden`}
                >
                  {renderPostImage(post)}
                </div>

                <div className="p-6 sm:p-7 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`px-2.5 py-1 rounded-full font-semibold ${post.tagStyle}`}
                    >
                      {post.tag}
                    </span>
                    <span className="text-slate-400 font-medium">
                      {post.date}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-heading font-bold text-slate-900 dark:text-white leading-snug group-hover:text-burnt-orange transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-sans leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-7 pt-0 flex items-center text-burnt-orange font-heading font-bold text-xs sm:text-sm gap-1.5 group-hover:gap-2.5 transition-all">
                <span>Read Full Article</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.article>
          ))}
        </div>

        {/* Load more */}
        {isBlogPage && visibleCount < filteredPosts.length && (
          <div className="mt-16 flex justify-center">
            <button
              onClick={() => setVisibleCount((v) => v + POSTS_PER_PAGE)}
              className="px-8 py-3.5 rounded-xl bg-burnt-orange text-white font-heading font-bold text-sm shadow-md hover:bg-[#d15e15] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              Load more articles
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
