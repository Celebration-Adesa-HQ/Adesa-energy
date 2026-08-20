"use client";

import { siteConfig } from "@/config/site";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import JobsSection from "./JobsSection";
import BenefitsSection from "./BenefitsSection";
import CultureSection from "./CultureSection";
import CtaSection from "./CtaSection";

export default function CareerSection() {
  const { hero, about, jobs, benefits, culture, cta } = siteConfig.careers;

  return (
    <div className="w-full min-w-0 font-sans">
      <HeroSection hero={hero} />
      <AboutSection about={about} />
      <JobsSection jobs={jobs} />
      <BenefitsSection benefits={benefits} />
      <CultureSection culture={culture} />
      <CtaSection cta={cta} />
    </div>
  );
}
