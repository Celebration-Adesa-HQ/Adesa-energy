"use client";

import { ArrowRight, Sparkles, Zap, Shield, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { useEffect, useState } from "react";
import Image from "next/image";

const HeroSection = ({ onNavClick }) => {
  const { hero } = siteConfig;

  const [values, setValues] = useState(hero.stats.map(() => 0));
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const duration = 2800;
    const startTime = performance.now();

    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setValues(hero.stats.map((stat) => Math.floor(stat.value * progress)));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [hero.stats]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % hero.images.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [hero.images.length]);

  return (
    <section
      id={hero.id}
      className="relative min-h-[90vh] flex items-center justify-center pt-8 pb-16 lg:py-24 bg-linear-to-b from-[#081126] via-[#0B1530] to-[#060b17] text-white overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 dark:bg-white/5 border border-white/15 backdrop-blur-md shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-xs sm:text-sm font-semibold tracking-wide text-sky-200">
                {hero.tagline || "Clean Energy Innovation"}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight leading-[1.12]">
              Power Your Fleet with{" "}
              <span className="bg-linear-to-r from-[#F37621] via-[#FBBF24] to-[#38BDF8] bg-clip-text text-transparent">
                Clean, Cost-Saving CNG
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-sans leading-relaxed">
              {hero.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3.5 pt-2 max-w-xl">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavClick(hero.ctas.primary.target)}
                aria-label={hero.ctas.primary.ariaLabel}
                className="group inline-flex items-center justify-center gap-2 bg-linear-to-r from-[#F37621] to-[#F59E0B] text-white px-7 py-3.5 rounded-xl font-heading font-bold text-base shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all cursor-pointer"
              >
                <span>{hero.ctas.primary.text}</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavClick(hero.ctas.secondary.target)}
                aria-label={hero.ctas.secondary.ariaLabel}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/20 px-6 py-3.5 rounded-xl font-heading font-semibold text-base backdrop-blur-md transition-all cursor-pointer"
              >
                <span>{hero.ctas.secondary.text}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavClick(hero.ctas.tertiary.target)}
                aria-label={hero.ctas.tertiary.ariaLabel}
                className="inline-flex items-center justify-center gap-1.5 text-slate-300 hover:text-white px-4 py-3.5 rounded-xl text-sm font-medium hover:bg-white/5 transition-all cursor-pointer sm:hidden"
              >
                <span>{hero.ctas.tertiary.text}</span>
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Animated Stat Badges */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-6 border-t border-white/10">
              {hero.stats.map((stat, idx) => (
                <div
                  key={stat.label}
                  className="bg-white/5 border border-white/10 rounded-2xl p-3 sm:p-4 backdrop-blur-md transition-transform hover:-translate-y-0.5"
                >
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-transparent bg-clip-text bg-linear-to-r from-sky-400 to-emerald-400">
                    {values[idx] || 0}
                    {stat.suffix}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans font-medium line-clamp-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT VISUAL / CAROUSEL FRAME */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            {/* Glow backdrop frame */}
            <div className="absolute -inset-1 bg-linear-to-r from-sky-500 to-amber-500 rounded-3xl blur-xl opacity-30 animate-pulse" />

            <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-slate-900 aspect-4/3 sm:aspect-16/11 lg:aspect-square">
              {hero.images.map((img, i) => (
                <motion.div
                  key={img}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: i === index ? 1 : 0 }}
                  transition={{ duration: 0.9, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={img}
                    alt="Adesa Energy CNG Installation & Conversion"
                    fill
                    priority={i === 0}
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />
                  {/* Subtle gradient vignette */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />
                </motion.div>
              ))}

              {/* Floating Trust Badge */}
              <div className="absolute bottom-4 inset-x-4 p-4 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-white/15 flex items-center justify-between text-white shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-300">
                      Standard CNG Conversion
                    </p>
                    <p className="text-sm font-heading font-bold text-white">
                      Mobile & Station Ready
                    </p>
                  </div>
                </div>

                {/* Carousel dots */}
                <div className="flex items-center gap-1.5">
                  {hero.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIndex(i)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        i === index
                          ? "w-6 bg-burnt-orange"
                          : "w-2 bg-white/30 hover:bg-white/60"
                      }`}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
