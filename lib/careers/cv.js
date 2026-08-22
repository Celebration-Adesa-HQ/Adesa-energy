import "server-only";

import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import { ACCEPTED_CV_EXTENSIONS, MAX_CV_SIZE } from "./application-schema";

const PDF_MIME = "application/pdf";
const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

function getExtension(filename) {
  return filename.split(".").pop()?.toLowerCase() ?? "";
}

function hasPdfSignature(buffer) {
  return buffer.subarray(0, 5).toString("ascii") === "%PDF-";
}

function hasZipSignature(buffer) {
  const signature = buffer.subarray(0, 4).toString("hex");
  return ["504b0304", "504b0506", "504b0708"].includes(signature);
}

export function safeCvFilename(filename, applicationId) {
  const extension = getExtension(filename);
  const base = filename
    .replace(/\.[^.]+$/, "")
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${base || "candidate-cv"}-${applicationId.slice(0, 8)}.${extension}`;
}

export async function inspectAndExtractCv(file, applicationId) {
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Select a PDF or DOCX CV");
  }
  if (file.size > MAX_CV_SIZE) {
    throw new Error("CV must be 4 MB or smaller");
  }

  const extension = getExtension(file.name);
  if (!ACCEPTED_CV_EXTENSIONS.includes(extension)) {
    throw new Error("CV must be a PDF or DOCX file");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const isPdf = extension === "pdf";
  const validMime = isPdf
    ? [PDF_MIME, "application/octet-stream"].includes(file.type)
    : [DOCX_MIME, "application/zip", "application/octet-stream"].includes(file.type);
  const validSignature = isPdf ? hasPdfSignature(buffer) : hasZipSignature(buffer);

  if (!validMime || !validSignature) {
    throw new Error("The uploaded file does not match its PDF or DOCX format");
  }

  const warnings = [];
  let text = "";

  try {
    if (isPdf) {
      let parser;
      try {
        parser = new PDFParse({ data: buffer });
        const result = await parser.getText({ first: 12 });
        text = result.text ?? "";
      } finally {
        await parser?.destroy();
      }
    } else {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value ?? "";
      warnings.push(...result.messages.map((message) => message.message).slice(0, 3));
    }
  } catch {
    warnings.push("The CV text could not be extracted and requires manual review.");
  }

  const normalizedText = text.replace(/\u0000/g, " ").replace(/\s+/g, " ").trim();
  if (normalizedText.length > 60_000) {
    warnings.push("Only the first 60,000 characters were evaluated.");
  }

  return {
    buffer,
    filename: safeCvFilename(file.name, applicationId),
    contentType: isPdf ? PDF_MIME : DOCX_MIME,
    text: normalizedText.slice(0, 60_000),
    warnings,
  };
}
