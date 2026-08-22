import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck, FileLock2, ShieldCheck } from "lucide-react";
import CareerApplicationForm from "@/components/Career_components/CareerApplicationForm";
import { constructMetadata } from "@/lib/metadata";
import { getCareerSlugs, getPublicCareerRole } from "@/lib/careers/roles";

export function generateStaticParams() {
  return getCareerSlugs().map((role) => ({ role }));
}

export async function generateMetadata({ params }) {
  const { role: slug } = await params;
  const role = getPublicCareerRole(slug);
  if (!role) return {};
  return constructMetadata({
    title: `Apply for ${role.title} | Adesa Energy Careers`,
    description: `Submit your application for the ${role.title} position at Adesa Energy.`,
    path: role.href,
    noIndex: true,
  });
}

export default async function CareerApplicationPage({ params, searchParams }) {
  const [{ role: slug }, query] = await Promise.all([params, searchParams]);
  const role = getPublicCareerRole(slug);
  if (!role) notFound();
  const isGeneralApplication = role.screeningMode === "manual";

  const reviewReference =
    !isGeneralApplication &&
    typeof query?.review === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(query.review)
      ? query.review
      : "";

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-950 dark:bg-[#07111f] dark:text-white">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-40" />
      <div className="pointer-events-none absolute -right-24 top-20 h-80 w-80 rounded-full bg-burnt-orange/10 blur-[100px]" />
      <div className="pointer-events-none absolute -left-20 bottom-24 h-72 w-72 rounded-full bg-light-blue/10 blur-[100px]" />

      <div className="site-container relative py-10 sm:py-16 lg:py-20">
        <Link
          href="/careers#jobs"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl text-sm font-bold text-slate-600 transition hover:text-burnt-orange dark:text-slate-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to open roles
        </Link>

        <div className="mt-8 grid min-w-0 gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start lg:gap-12">
          <aside className="lg:sticky lg:top-32">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-burnt-orange">
              {reviewReference
                ? "Human review request"
                : isGeneralApplication
                  ? "Talent network application"
                  : "Career application"}
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-[-0.045em] sm:text-5xl">
              {role.title}
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-slate-600 dark:text-slate-300">
              {role.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-sm">
              {[role.department, role.location, role.type].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-10 space-y-5 border-t border-slate-200 pt-8 dark:border-white/10">
              {[
                {
                  icon: FileLock2,
                  title: "Private processing",
                  text: "Your CV is processed in memory and is not stored in a website database.",
                },
                isGeneralApplication
                  ? {
                      icon: BadgeCheck,
                      title: "Direct human review",
                      text: "General applications bypass automated scoring and go directly to the recruitment team.",
                    }
                  : {
                      icon: BadgeCheck,
                      title: "Explainable screening",
                      text: "A local rubric checks role-related evidence. It does not use a paid or external AI service.",
                    },
                {
                  icon: ShieldCheck,
                  title: isGeneralApplication ? "Future opportunities" : "Human decisions",
                  text: isGeneralApplication
                    ? "Joining the talent network is not an active vacancy or a guarantee of future contact."
                    : "The screening result is provisional. Adesa Energy's team makes every recruitment decision.",
                },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-burnt-orange/10 text-burnt-orange">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-bold">{title}</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <CareerApplicationForm role={role} reviewReference={reviewReference} />
        </div>
      </div>
    </div>
  );
}
