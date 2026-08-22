import { NextResponse } from "next/server";
import { applicationFieldsSchema } from "@/lib/careers/application-schema";
import { createApplicationToken, verifyApplicationToken } from "@/lib/careers/application-token";
import { inspectAndExtractCv } from "@/lib/careers/cv";
import {
  sendApplicantAcknowledgement,
  sendApplicantAdvance,
  sendRecruiterApplication,
} from "@/lib/careers/email";
import { checkSubmissionRate, getRequestIp } from "@/lib/careers/rate-limit";
import { getCareerRole } from "@/lib/careers/roles";
import { screenCv } from "@/lib/careers/screening";

export const runtime = "nodejs";
export const maxDuration = 60;

function json(body, status = 200, headers = {}) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

export function GET(request) {
  const roleSlug = new URL(request.url).searchParams.get("role") ?? "";
  if (!getCareerRole(roleSlug)) {
    return json({ status: "error", message: "Select a valid role" }, 400);
  }

  try {
    return json({ status: "success", token: createApplicationToken(roleSlug) });
  } catch (error) {
    console.error("Career application token configuration error", error.message);
    return json(
      { status: "error", message: "Applications are temporarily unavailable" },
      503,
    );
  }
}

export async function POST(request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 4_500_000) {
    return json({ status: "error", message: "The application upload is too large" }, 413);
  }

  try {
    const formData = await request.formData();

    if (String(formData.get("website") || "").trim()) {
      return json({
        status: "success",
        message: "Your application has been received.",
      });
    }

    const parsed = applicationFieldsSchema.safeParse({
      applicationId: formData.get("applicationId"),
      role: formData.get("role"),
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      location: formData.get("location"),
      portfolio: formData.get("portfolio") || "",
      coverNote: formData.get("coverNote"),
      desiredRole: formData.get("desiredRole") || "",
      areaOfInterest: formData.get("areaOfInterest") || "",
      privacyConsent: formData.get("privacyConsent"),
      screeningConsent: formData.get("screeningConsent"),
      token: formData.get("token"),
      website: "",
      reviewOf: formData.get("reviewOf") || "",
    });

    if (!parsed.success) {
      return json(
        { status: "error", message: parsed.error.issues[0]?.message || "Check your application details" },
        400,
      );
    }

    const fields = parsed.data;
    const role = getCareerRole(fields.role);
    if (!role) return json({ status: "error", message: "Select a valid role" }, 400);

    if (role.screeningMode === "manual") {
      if (fields.desiredRole.length < 2) {
        return json({ status: "error", message: "Enter the role you are interested in" }, 400);
      }
      if (!fields.areaOfInterest) {
        return json({ status: "error", message: "Select an area of interest" }, 400);
      }
    } else if (fields.screeningConsent !== "true") {
      return json({ status: "error", message: "Screening consent is required" }, 400);
    }

    const tokenResult = verifyApplicationToken(fields.token, fields.role);
    if (!tokenResult.valid) {
      const expired = tokenResult.code === "token_expired";
      return json(
        {
          status: "error",
          code: tokenResult.code,
          message: expired
            ? "Your secure form session expired. Refresh the form and try again."
            : "We could not verify this application. Refresh the form and try again.",
        },
        400,
      );
    }

    const rate = checkSubmissionRate({
      ip: getRequestIp(request),
      email: fields.email,
      applicationId: fields.applicationId,
    });
    if (!rate.allowed) {
      return json(
        { status: "error", message: "Too many applications were submitted. Please try again later." },
        429,
        { "Retry-After": String(rate.retryAfter) },
      );
    }

    const fileEntries = formData.getAll("cv");
    if (fileEntries.length !== 1) {
      return json({ status: "error", message: "Attach one PDF or DOCX CV" }, 400);
    }

    const cv = await inspectAndExtractCv(fileEntries[0], fields.applicationId);
    const applicant = {
      fullName: fields.fullName,
      email: fields.email,
      phone: fields.phone,
      location: fields.location,
      portfolio: fields.portfolio,
      coverNote: fields.coverNote,
      desiredRole: fields.desiredRole,
      areaOfInterest: fields.areaOfInterest,
    };

    const effectiveReviewOf = role.screeningMode === "rubric" ? fields.reviewOf : "";
    const result = role.screeningMode === "manual"
      ? {
          outcome: "manual_review",
          score: null,
          matchedCriteria: [],
          missingCriteria: [],
          warnings: ["General talent-network application requires human review."],
        }
      : effectiveReviewOf
      ? {
          outcome: "manual_review",
          score: null,
          matchedCriteria: [],
          missingCriteria: [],
          warnings: ["Applicant requested human intervention."],
        }
      : screenCv({ text: cv.text, rubric: role.rubric, parserWarnings: cv.warnings });

    await sendApplicantAcknowledgement({
      applicant,
      role,
      applicationId: fields.applicationId,
      outcome: result.outcome,
      reviewOf: effectiveReviewOf,
    });

    if (result.outcome === "advance") {
      await Promise.all([
        sendRecruiterApplication({
          applicant,
          role,
          applicationId: fields.applicationId,
          result,
          cv,
        }),
        sendApplicantAdvance({ applicant, role, applicationId: fields.applicationId }),
      ]);
    } else if (result.outcome === "manual_review") {
      await sendRecruiterApplication({
        applicant,
        role,
        applicationId: fields.applicationId,
        result,
        cv,
        reviewOf: effectiveReviewOf,
      });
    }

    return json({
      status: "success",
      applicationId: fields.applicationId,
      message: role.screeningMode === "manual"
        ? "Your general application has joined the Adesa Energy talent network."
        : effectiveReviewOf
        ? "Your human review request has been received."
        : "Your application has been received. Check your email for confirmation.",
    });
  } catch (error) {
    console.error("Career application failed", error.message);
    const isFileError = /CV|PDF|DOCX|uploaded file/i.test(error.message);
    return json(
      {
        status: "error",
        message: isFileError
          ? error.message
          : "We could not complete your application. Please try again.",
      },
      isFileError ? 400 : 502,
    );
  }
}
