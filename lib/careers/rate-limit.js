import "server-only";

import { createHash } from "node:crypto";

const ipAttempts = new Map();
const emailAttempts = new Map();
const applicationAttempts = new Map();

const WINDOWS = {
  ip: { duration: 15 * 60 * 1000, limit: 8 },
  email: { duration: 60 * 60 * 1000, limit: 4 },
  application: { duration: 60 * 60 * 1000, limit: 3 },
};

function prune(map, now, duration) {
  if (map.size < 500) return;
  for (const [key, timestamps] of map.entries()) {
    const recent = timestamps.filter((time) => now - time < duration);
    if (recent.length) map.set(key, recent);
    else map.delete(key);
  }
}

function consume(map, key, policy, now) {
  prune(map, now, policy.duration);
  const recent = (map.get(key) ?? []).filter((time) => now - time < policy.duration);
  if (recent.length >= policy.limit) return false;
  recent.push(now);
  map.set(key, recent);
  return true;
}

export function getRequestIp(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function checkSubmissionRate({ ip, email, applicationId }) {
  const now = Date.now();
  const ipKey = createHash("sha256").update(ip).digest("hex");
  const normalizedEmail = email.trim().toLowerCase();

  if (!consume(applicationAttempts, applicationId, WINDOWS.application, now)) {
    return { allowed: false, retryAfter: 3600 };
  }
  if (!consume(emailAttempts, normalizedEmail, WINDOWS.email, now)) {
    return { allowed: false, retryAfter: 3600 };
  }
  if (!consume(ipAttempts, ipKey, WINDOWS.ip, now)) {
    return { allowed: false, retryAfter: 900 };
  }

  return { allowed: true };
}

