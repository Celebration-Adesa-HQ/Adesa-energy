import { z } from "zod";

export const MAX_CV_SIZE = 4_000_000;
export const ACCEPTED_CV_EXTENSIONS = ["pdf", "docx"];
export const GENERAL_INTEREST_AREAS = [
  "Engineering",
  "Sustainability",
  "Design",
  "Operations",
  "Finance",
  "Legal and Compliance",
  "Commercial and Customer Support",
  "Other",
];

const optionalUrl = z.union([
  z.literal(""),
  z.string().trim().url("Enter a valid portfolio or LinkedIn URL"),
]);

export const applicationFieldsSchema = z.object({
  applicationId: z.string().uuid("Invalid application reference"),
  role: z.string().trim().min(1, "Select a valid role"),
  fullName: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(24)
    .regex(/^[+\d\s().-]+$/, "Enter a valid phone number"),
  location: z.string().trim().min(2, "Enter your location").max(100),
  portfolio: optionalUrl,
  coverNote: z.string().trim().min(20, "Tell us briefly about your interest").max(2000),
  desiredRole: z.string().trim().max(100).optional().default(""),
  areaOfInterest: z
    .union([z.literal(""), z.enum(GENERAL_INTEREST_AREAS)])
    .optional()
    .default(""),
  privacyConsent: z.literal("true"),
  screeningConsent: z.enum(["true", "false"]),
  token: z.string().min(20, "Application security token is missing"),
  website: z.string().max(0).optional().default(""),
  reviewOf: z.union([z.literal(""), z.string().uuid()]).optional().default(""),
});

export const screeningResultSchema = z.object({
  outcome: z.enum(["advance", "not_advance", "manual_review"]),
  score: z.number().int().min(0).max(100).nullable(),
  matchedCriteria: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      evidence: z.string(),
      mandatory: z.boolean(),
    }),
  ),
  missingCriteria: z.array(z.string()),
  warnings: z.array(z.string()),
});
