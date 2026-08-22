import "server-only";

import { Resend } from "resend";

const SITE_URL = "https://www.adesaenergy.com";

function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#039;",
      '"': "&quot;",
    };
    return entities[character];
  });
}

function getEmailConfig() {
  const apiKey = process.env.RESEND_CAREERS_API_KEY || process.env.RESEND_CONTACT_API_KEY;
  const configuredFrom = process.env.RESEND_CAREERS_FROM || process.env.RESEND_FROM;
  const recruiter = process.env.CAREERS_TO_EMAIL || "career@adesahq.com";

  if (!apiKey || !configuredFrom) {
    throw new Error("Career email configuration is incomplete");
  }

  return {
    resend: new Resend(apiKey),
    from: configuredFrom.includes("<")
      ? configuredFrom
      : `Adesa Energy Careers <${configuredFrom}>`,
    recruiter,
  };
}

function baseTemplate({ preview, title, greeting, body, action }) {
  return `<!doctype html>
  <html lang="en">
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(preview)}</title></head>
    <body style="margin:0;background:#f2f5f8;color:#172033;font-family:Arial,Helvetica,sans-serif;">
      <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preview)}</div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f5f8;padding:28px 12px;">
        <tr><td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 14px 40px rgba(7,17,31,.10);">
            <tr><td style="background:#07111f;padding:30px 34px;border-bottom:5px solid #f37621;">
              <img src="${SITE_URL}/adesa-energy.png" width="112" alt="Adesa Energy" style="display:block;max-width:112px;height:auto;margin-bottom:18px;">
              <p style="margin:0;color:#f37621;font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;">Adesa Energy Careers</p>
              <h1 style="margin:10px 0 0;color:#ffffff;font-size:27px;line-height:1.2;">${escapeHtml(title)}</h1>
            </td></tr>
            <tr><td style="padding:34px;">
              <p style="margin:0 0 18px;font-size:17px;font-weight:700;color:#22244e;">${escapeHtml(greeting)}</p>
              ${body}
              ${action || ""}
            </td></tr>
            <tr><td style="background:#0b1528;padding:24px 34px;color:#cbd5e1;font-size:12px;line-height:1.6;">
              <strong style="color:#ffffff;">Adesa Energy</strong><br>
              Powering progress, fueling tomorrow.<br>
              <a href="${SITE_URL}" style="color:#f37621;text-decoration:none;">adesaenergy.com</a>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body>
  </html>`;
}

function paragraph(value) {
  return `<p style="margin:0 0 16px;color:#4b5563;font-size:15px;line-height:1.75;">${escapeHtml(value)}</p>`;
}

function referencePanel({ roleTitle, applicationId, originalReference }) {
  return `<div style="margin:24px 0;padding:18px 20px;border-radius:12px;background:#f7f8fb;border:1px solid #e3e8ef;">
    <p style="margin:0 0 7px;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:.08em;">Position</p>
    <p style="margin:0 0 14px;color:#22244e;font-size:15px;font-weight:700;">${escapeHtml(roleTitle)}</p>
    <p style="margin:0 0 7px;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:.08em;">Application reference</p>
    <p style="margin:0;color:#22244e;font-size:14px;font-weight:700;word-break:break-all;">${escapeHtml(applicationId)}</p>
    ${originalReference ? `<p style="margin:14px 0 7px;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:.08em;">Original reference</p><p style="margin:0;color:#22244e;font-size:14px;font-weight:700;word-break:break-all;">${escapeHtml(originalReference)}</p>` : ""}
  </div>`;
}

async function send(payload, idempotencyKey) {
  const { resend, from } = getEmailConfig();
  const { data, error } = await resend.emails.send(
    { ...payload, from },
    { idempotencyKey },
  );
  if (error) throw new Error(error.message || "Resend rejected a career email");
  return data;
}

export async function sendApplicantAcknowledgement({
  applicant,
  role,
  applicationId,
  outcome,
  reviewOf,
}) {
  const isReview = Boolean(reviewOf);
  const isTalentNetwork = role.screeningMode === "manual";
  const reviewUrl = `${SITE_URL}/careers/apply/${role.slug}?review=${encodeURIComponent(applicationId)}`;
  const subject = isTalentNetwork
    ? `Adesa Energy | General Application Received — ${applicant.desiredRole} — Ref: ${applicationId}`
    : isReview
      ? `Adesa Energy | Human Review Request Received — ${role.title} — Ref: ${applicationId}`
      : `Adesa Energy | Application Received — ${role.title} — Ref: ${applicationId}`;

  const reviewAction =
    !isReview && outcome === "not_advance"
      ? `<div style="margin-top:26px;padding:20px;border-left:4px solid #f37621;background:#fff7ed;border-radius:8px;">
          <p style="margin:0 0 12px;color:#7c2d12;font-size:14px;line-height:1.6;">You may request a human review of this application. You will need to upload your CV again because Adesa Energy does not retain CV files after processing.</p>
          <a href="${reviewUrl}" style="display:inline-block;padding:11px 17px;border-radius:9px;background:#f37621;color:#ffffff;font-weight:700;text-decoration:none;">Request human review</a>
        </div>`
      : "";

  return send(
    {
      to: applicant.email,
      subject,
      html: baseTemplate({
        preview: subject,
        title: isTalentNetwork
          ? "Talent network application received"
          : isReview
            ? "Human review request received"
            : "Application received",
        greeting: `Hello ${applicant.fullName},`,
        body: `${paragraph(
          isTalentNetwork
            ? `Thank you for expressing interest in ${applicant.desiredRole} opportunities at Adesa Energy. Your CV has been sent to our recruitment team for human review and added to the current talent-network process.`
            : isReview
            ? "Adesa Energy has received your request for a human review. Our recruitment team will assess the CV you provided."
            : "Thank you for applying to Adesa Energy. Your application has been received and processed for the position below.",
        )}${referencePanel({ roleTitle: isTalentNetwork ? applicant.desiredRole : role.title, applicationId, originalReference: reviewOf })}${paragraph(
          isTalentNetwork
            ? "This general application is not connected to an active vacancy and does not guarantee future contact, an interview, or employment."
            : "This message confirms receipt only. It is not an offer of employment or a guarantee of an interview.",
        )}`,
        action: reviewAction,
      }),
    },
    `careers-ack-${applicationId}`,
  );
}

export async function sendApplicantAdvance({ applicant, role, applicationId }) {
  const subject = `Adesa Energy | Application Update — ${role.title} — Initial Screening Passed — Ref: ${applicationId}`;
  return send(
    {
      to: applicant.email,
      subject,
      html: baseTemplate({
        preview: subject,
        title: "Initial screening passed",
        greeting: `Hello ${applicant.fullName},`,
        body: `${paragraph(
          "Your application has met the published criteria for Adesa Energy's initial screening stage and has been forwarded to our recruitment team for human review.",
        )}${referencePanel({ roleTitle: role.title, applicationId })}${paragraph(
          "Passing this stage does not guarantee an interview or employment. We will contact you if the team selects your application for the next step.",
        )}`,
      }),
    },
    `careers-advance-${applicationId}`,
  );
}

function recruiterDetails({ applicant, role, applicationId, reviewOf }) {
  const fields = [
    ["Applicant", applicant.fullName],
    ["Email", applicant.email],
    ["Phone", applicant.phone],
    ["Location", applicant.location],
    ["Role", role.title],
    ...(applicant.desiredRole ? [["Desired role", applicant.desiredRole]] : []),
    ...(applicant.areaOfInterest ? [["Area of interest", applicant.areaOfInterest]] : []),
    ["Application reference", applicationId],
    ...(reviewOf ? [["Original reference", reviewOf]] : []),
    ...(applicant.portfolio ? [["Portfolio / LinkedIn", applicant.portfolio]] : []),
  ];
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0;border-collapse:collapse;">
    ${fields
      .map(
        ([label, value]) => `<tr><td style="padding:10px;border-bottom:1px solid #e5e7eb;color:#64748b;font-size:13px;width:34%;">${escapeHtml(label)}</td><td style="padding:10px;border-bottom:1px solid #e5e7eb;color:#172033;font-size:14px;font-weight:600;word-break:break-word;">${escapeHtml(value)}</td></tr>`,
      )
      .join("")}
  </table>`;
}

function screeningSummary(result) {
  const matched = result.matchedCriteria.length
    ? `<h3 style="color:#22244e;font-size:16px;margin:24px 0 10px;">Matched criteria</h3><ul style="padding-left:20px;color:#4b5563;line-height:1.7;">${result.matchedCriteria
        .map(
          (item) => `<li style="margin-bottom:10px;"><strong>${escapeHtml(item.label)}</strong><br><span style="font-size:13px;">${escapeHtml(item.evidence)}</span></li>`,
        )
        .join("")}</ul>`
    : "";
  const missing = result.missingCriteria.length
    ? `<p style="margin:16px 0;color:#4b5563;font-size:14px;"><strong>Missing criteria:</strong> ${escapeHtml(result.missingCriteria.join(", "))}</p>`
    : "";
  const warnings = result.warnings.length
    ? `<p style="margin:16px 0;color:#9a3412;font-size:14px;"><strong>Processing notes:</strong> ${escapeHtml(result.warnings.join(" "))}</p>`
    : "";
  return `${matched}${missing}${warnings}`;
}

export async function sendRecruiterApplication({
  applicant,
  role,
  applicationId,
  result,
  cv,
  reviewOf,
}) {
  const { recruiter } = getEmailConfig();
  const isReview = Boolean(reviewOf);
  const isTalentNetwork = role.screeningMode === "manual";
  const isAdvance = result.outcome === "advance";
  const subject = isTalentNetwork
    ? `[TALENT NETWORK] ${applicant.desiredRole} — ${applicant.fullName} — Ref: ${applicationId}`
    : isReview
      ? `[HUMAN REVIEW REQUEST] ${role.title} — ${applicant.fullName} — Original Ref: ${reviewOf}`
      : isAdvance
        ? `[ADVANCE FOR REVIEW] ${role.title} — ${applicant.fullName} — Score: ${result.score}% — Ref: ${applicationId}`
        : `[MANUAL REVIEW REQUIRED] ${role.title} — ${applicant.fullName} — Ref: ${applicationId}`;

  return send(
    {
      to: recruiter,
      replyTo: applicant.email,
      subject,
      html: baseTemplate({
        preview: subject,
        title: isTalentNetwork
          ? "New talent network application"
          : isReview
            ? "Applicant requested human review"
            : isAdvance
              ? "Application recommended for review"
              : "Manual review required",
        greeting: "Adesa Energy Recruitment Team,",
        body: `${paragraph(
          isTalentNetwork
            ? "This candidate submitted a general application for a future opportunity. Review the attached CV manually; no rubric score was produced."
            : isReview
            ? "The applicant requested human intervention for a previous application. Review the attached CV without relying on the earlier automated outcome."
            : isAdvance
              ? "The local rubric scorer found evidence for every mandatory criterion and met the configured advancement threshold. A human decision is still required."
              : "The application could not be evaluated reliably by the local rubric scorer. Review the attached CV manually.",
        )}${recruiterDetails({ applicant, role, applicationId, reviewOf })}${
          isTalentNetwork
            ? ""
            : isAdvance
            ? `<div style="padding:16px 18px;border-radius:10px;background:#ecfdf5;color:#065f46;font-weight:700;">Local rubric score: ${result.score}%</div>${screeningSummary(result)}`
            : screeningSummary(result)
        }<h3 style="color:#22244e;font-size:16px;margin:24px 0 8px;">Applicant note</h3>${paragraph(applicant.coverNote)}`,
      }),
      attachments: [
        {
          content: cv.buffer,
          filename: cv.filename,
          contentType: cv.contentType,
        },
      ],
    },
    `${isTalentNetwork ? "careers-talent-network" : isReview ? "careers-human-review" : isAdvance ? "careers-recruiter-advance" : "careers-manual"}-${applicationId}`,
  );
}
