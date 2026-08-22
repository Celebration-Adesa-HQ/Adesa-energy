import "server-only";

import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

const TOKEN_TTL_MS = 2 * 60 * 60 * 1000;
const MIN_COMPLETION_MS = 3_000;

function getSecret() {
  const secret = process.env.APPLICATION_TOKEN_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("APPLICATION_TOKEN_SECRET must contain at least 32 characters");
  }
  return secret;
}

function sign(payload) {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function createApplicationToken(role) {
  const payload = Buffer.from(
    JSON.stringify({ role, issuedAt: Date.now(), nonce: randomUUID() }),
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyApplicationToken(token, expectedRole) {
  try {
    const [payload, signature] = token.split(".");
    if (!payload || !signature) return { valid: false, code: "invalid_token" };

    const expectedSignature = sign(payload);
    const actualBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);
    if (
      actualBuffer.length !== expectedBuffer.length ||
      !timingSafeEqual(actualBuffer, expectedBuffer)
    ) {
      return { valid: false, code: "invalid_token" };
    }

    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    const age = Date.now() - parsed.issuedAt;
    if (parsed.role !== expectedRole) return { valid: false, code: "invalid_token" };
    if (age < MIN_COMPLETION_MS) return { valid: false, code: "submitted_too_quickly" };
    if (age > TOKEN_TTL_MS || age < 0) return { valid: false, code: "token_expired" };

    return { valid: true };
  } catch {
    return { valid: false, code: "invalid_token" };
  }
}

