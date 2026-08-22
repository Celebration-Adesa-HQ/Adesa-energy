"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  FileText,
  LoaderCircle,
  LockKeyhole,
  UploadCloud,
} from "lucide-react";
import {
  GENERAL_INTEREST_AREAS,
  MAX_CV_SIZE,
} from "@/lib/careers/application-schema";

const formSchema = z.object({
  applicationType: z.enum(["listed", "general"]),
  fullName: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(24)
    .regex(/^[+\d\s().-]+$/, "Enter a valid phone number"),
  location: z.string().trim().min(2, "Enter your location").max(100),
  portfolio: z.union([
    z.literal(""),
    z.string().trim().url("Enter a complete URL beginning with https://"),
  ]),
  coverNote: z.string().trim().min(20, "Write at least 20 characters").max(2000),
  desiredRole: z.string().trim().max(100),
  areaOfInterest: z.union([z.literal(""), z.enum(GENERAL_INTEREST_AREAS)]),
  cv: z
    .custom((value) => value instanceof FileList && value.length === 1, "Attach one CV")
    .refine((files) => files?.[0]?.size <= MAX_CV_SIZE, "CV must be 4 MB or smaller")
    .refine((files) => /\.(pdf|docx)$/i.test(files?.[0]?.name || ""), "Use a PDF or DOCX file"),
  privacyConsent: z.boolean().refine(Boolean, "Consent is required"),
  screeningConsent: z.boolean(),
  website: z.string().max(0).optional(),
}).superRefine((values, context) => {
  if (values.applicationType === "general") {
    if (values.desiredRole.length < 2) {
      context.addIssue({
        code: "custom",
        path: ["desiredRole"],
        message: "Enter the role you are interested in",
      });
    }
    if (!values.areaOfInterest) {
      context.addIssue({
        code: "custom",
        path: ["areaOfInterest"],
        message: "Select an area of interest",
      });
    }
  } else if (!values.screeningConsent) {
    context.addIssue({
      code: "custom",
      path: ["screeningConsent"],
      message: "Consent is required",
    });
  }
});

const fieldClass =
  "mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-[16px] text-slate-950 shadow-sm transition placeholder:text-slate-400 focus:border-burnt-orange focus:outline-none focus:ring-4 focus:ring-burnt-orange/10 dark:border-white/15 dark:bg-white/[0.055] dark:text-white dark:placeholder:text-slate-500";

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-400">{message}</p>;
}

export default function CareerApplicationForm({ role, reviewReference = "" }) {
  const isGeneralApplication = role.screeningMode === "manual";
  const [token, setToken] = useState("");
  const [applicationId, setApplicationId] = useState("");
  const [tokenError, setTokenError] = useState("");
  const [submitState, setSubmitState] = useState({ status: "idle", message: "" });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      applicationType: isGeneralApplication ? "general" : "listed",
      fullName: "",
      email: "",
      phone: "",
      location: "",
      portfolio: "",
      coverNote: "",
      desiredRole: "",
      areaOfInterest: "",
      privacyConsent: false,
      screeningConsent: false,
      website: "",
    },
  });

  const selectedFile = watch("cv")?.[0];

  const refreshToken = useCallback(async () => {
    setTokenError("");
    try {
      const response = await fetch(`/api/careers/apply?role=${encodeURIComponent(role.slug)}`, {
        cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok || !result.token) throw new Error(result.message || "Secure form unavailable");
      setToken(result.token);
    } catch (error) {
      setTokenError(error.message || "Secure form unavailable");
    }
  }, [role.slug]);

  useEffect(() => {
    setApplicationId(window.crypto.randomUUID());
    refreshToken();
  }, [refreshToken]);

  const onSubmit = async (values) => {
    if (!token || !applicationId) {
      setSubmitState({ status: "error", message: "The secure form is not ready. Please refresh and try again." });
      return;
    }

    setSubmitState({ status: "submitting", message: "Securely processing your application…" });
    const data = new FormData();
    data.append("applicationId", applicationId);
    data.append("role", role.slug);
    data.append("fullName", values.fullName);
    data.append("email", values.email);
    data.append("phone", values.phone);
    data.append("location", values.location);
    data.append("portfolio", values.portfolio || "");
    data.append("coverNote", values.coverNote);
    data.append("desiredRole", values.desiredRole || "");
    data.append("areaOfInterest", values.areaOfInterest || "");
    data.append("cv", values.cv[0]);
    data.append("privacyConsent", String(values.privacyConsent));
    data.append("screeningConsent", String(values.screeningConsent));
    data.append("token", token);
    data.append("reviewOf", reviewReference);
    data.append("website", values.website || "");

    try {
      const response = await fetch("/api/careers/apply", { method: "POST", body: data });
      const result = await response.json();
      if (!response.ok) {
        if (["token_expired", "invalid_token", "submitted_too_quickly"].includes(result.code)) {
          await refreshToken();
        }
        throw new Error(result.message || "We could not submit your application");
      }
      setSubmitState({ status: "success", message: result.message });
    } catch (error) {
      setSubmitState({ status: "error", message: error.message || "We could not submit your application" });
    }
  };

  if (submitState.status === "success") {
    return (
      <section className="rounded-3xl border border-emerald-200 bg-white p-7 shadow-xl shadow-slate-900/5 dark:border-emerald-400/20 dark:bg-white/[0.055] sm:p-10">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">Submitted securely</p>
        <h2 className="mt-3 text-3xl font-bold tracking-[-0.035em]">Application received.</h2>
        <p className="mt-4 max-w-xl leading-7 text-slate-600 dark:text-slate-300">{submitState.message}</p>
        <div className="mt-6 rounded-xl bg-slate-100 p-4 dark:bg-white/5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Reference</p>
          <p className="mt-1 break-all font-mono text-sm font-bold text-slate-800 dark:text-slate-200">{applicationId}</p>
        </div>
        <Link href="/careers#jobs" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-burnt-orange px-6 py-3 font-bold text-white transition hover:bg-[#dc681c]">
          Return to careers
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    );
  }

  return (
    <section className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5 dark:border-white/10 dark:bg-white/[0.045] sm:p-8 lg:p-10">
      {reviewReference && (
        <div className="mb-8 rounded-2xl border border-burnt-orange/25 bg-orange-50 p-5 text-sm leading-6 text-orange-950 dark:bg-burnt-orange/10 dark:text-orange-100">
          <strong className="block">Human review requested</strong>
          Re-upload your CV and submit this form. The recruitment team will receive it for a person-led assessment without relying on the earlier score.
        </div>
      )}

      <div className="flex flex-col gap-3 border-b border-slate-200 pb-7 dark:border-white/10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-burnt-orange">Secure application</p>
          <h2 className="mt-2 text-2xl font-bold tracking-[-0.025em]">Tell us about your work.</h2>
        </div>
        <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <LockKeyhole className="h-4 w-4 text-emerald-600" />
          Encrypted in transit
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-7" noValidate>
        <input type="hidden" {...register("applicationType")} />
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="text-sm font-bold">
            Full name <span className="text-burnt-orange">*</span>
            <input autoComplete="name" {...register("fullName")} className={fieldClass} placeholder="Your full name" />
            <FieldError message={errors.fullName?.message} />
          </label>
          <label className="text-sm font-bold">
            Email address <span className="text-burnt-orange">*</span>
            <input type="email" autoComplete="email" {...register("email")} className={fieldClass} placeholder="you@example.com" />
            <FieldError message={errors.email?.message} />
          </label>
          <label className="text-sm font-bold">
            Phone number <span className="text-burnt-orange">*</span>
            <input type="tel" autoComplete="tel" {...register("phone")} className={fieldClass} placeholder="+234 800 000 0000" />
            <FieldError message={errors.phone?.message} />
          </label>
          <label className="text-sm font-bold">
            Current location <span className="text-burnt-orange">*</span>
            <input autoComplete="address-level2" {...register("location")} className={fieldClass} placeholder="City, country" />
            <FieldError message={errors.location?.message} />
          </label>
        </div>

        {isGeneralApplication && (
          <div className="grid gap-6 rounded-2xl border border-burnt-orange/20 bg-orange-50/70 p-5 dark:bg-burnt-orange/[0.07] sm:grid-cols-2">
            <label className="text-sm font-bold">
              Desired role or job title <span className="text-burnt-orange">*</span>
              <input
                {...register("desiredRole")}
                className={fieldClass}
                placeholder="e.g. Operations Coordinator"
              />
              <FieldError message={errors.desiredRole?.message} />
            </label>
            <label className="text-sm font-bold">
              Area of interest <span className="text-burnt-orange">*</span>
              <select {...register("areaOfInterest")} className={fieldClass}>
                <option value="">Select an area</option>
                {GENERAL_INTEREST_AREAS.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
              <FieldError message={errors.areaOfInterest?.message} />
            </label>
          </div>
        )}

        <label className="block text-sm font-bold">
          LinkedIn or portfolio <span className="font-normal text-slate-500">(optional)</span>
          <input type="url" inputMode="url" {...register("portfolio")} className={fieldClass} placeholder="https://" />
          <FieldError message={errors.portfolio?.message} />
        </label>

        <label className="block text-sm font-bold">
          {isGeneralApplication ? "How could you contribute?" : "Short application note"} <span className="text-burnt-orange">*</span>
          <textarea
            {...register("coverNote")}
            rows={6}
            className={`${fieldClass} resize-y`}
            placeholder={
              isGeneralApplication
                ? "Tell us how your experience could contribute to Adesa Energy's mission and future growth."
                : "Tell us why this role fits the work you have done and the impact you want to make."
            }
          />
          <span className="mt-2 block text-xs font-normal text-slate-500">Maximum 2,000 characters.</span>
          <FieldError message={errors.coverNote?.message} />
        </label>

        <div>
          <label className="group block cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition hover:border-burnt-orange hover:bg-orange-50/60 dark:border-white/15 dark:bg-white/[0.025] dark:hover:border-burnt-orange/70 dark:hover:bg-burnt-orange/5">
            <input type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" {...register("cv")} className="sr-only" />
            <UploadCloud className="mx-auto h-8 w-8 text-burnt-orange" />
            <span className="mt-3 block font-bold">{selectedFile ? selectedFile.name : "Choose your CV"}</span>
            <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">PDF or DOCX, maximum 4 MB</span>
            {selectedFile && <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm dark:bg-white/10 dark:text-slate-200"><FileText className="h-3.5 w-3.5" />Ready to upload</span>}
          </label>
          <FieldError message={errors.cv?.message} />
        </div>

        <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-px w-px opacity-0" {...register("website")} />

        <div className="space-y-4 rounded-2xl bg-slate-100 p-5 dark:bg-white/5">
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
            <input type="checkbox" {...register("privacyConsent")} className="mt-1 h-5 w-5 shrink-0 accent-[#f37621]" />
            <span>I consent to Adesa Energy processing my application data and emailing me about this recruitment process. Read the <Link href="/privacy-policy" className="font-bold text-burnt-orange underline underline-offset-2">privacy policy</Link>.</span>
          </label>
          <FieldError message={errors.privacyConsent?.message} />
          {!isGeneralApplication && (
            <>
              <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
                <input type="checkbox" {...register("screeningConsent")} className="mt-1 h-5 w-5 shrink-0 accent-[#f37621]" />
                <span>I understand that a local, rules-based tool performs provisional screening and that I may request human review.</span>
              </label>
              <FieldError message={errors.screeningConsent?.message} />
            </>
          )}
        </div>

        {(tokenError || submitState.status === "error") && (
          <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <span>{submitState.message || tokenError}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !token || !applicationId}
          className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-burnt-orange px-6 py-3.5 font-bold text-white shadow-lg shadow-orange-950/15 transition hover:-translate-y-0.5 hover:bg-[#dc681c] disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0 sm:w-auto"
        >
          {isSubmitting ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
          {isSubmitting
            ? "Processing application…"
            : reviewReference
              ? "Request human review"
              : isGeneralApplication
                ? "Join the talent network"
                : "Submit application"}
        </button>
        <p className="text-xs leading-5 text-slate-500" aria-live="polite">
          {submitState.status === "submitting" ? submitState.message : "Please keep this page open while your CV is securely processed."}
        </p>
      </form>
    </section>
  );
}
