import { screeningResultSchema } from "./application-schema";

function normalize(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function getEvidence(text, normalizedText, phrase) {
  const index = normalizedText.indexOf(normalize(phrase));
  if (index < 0) return "";
  const start = Math.max(0, index - 90);
  const end = Math.min(text.length, index + phrase.length + 120);
  return text.slice(start, end).replace(/\s+/g, " ").trim();
}

export function screenCv({ text, rubric, parserWarnings = [] }) {
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  if (text.length < 180 || wordCount < 40) {
    return screeningResultSchema.parse({
      outcome: "manual_review",
      score: null,
      matchedCriteria: [],
      missingCriteria: [],
      warnings: [
        ...parserWarnings,
        "The CV contained too little extractable text for reliable automated screening.",
      ],
    });
  }

  const normalizedText = normalize(text);
  const matchedCriteria = [];
  const missingCriteria = [];
  let earnedWeight = 0;
  const totalWeight = rubric.criteria.reduce((sum, criterion) => sum + criterion.weight, 0);

  for (const criterion of rubric.criteria) {
    const phrase = criterion.phrases.find((candidate) =>
      normalizedText.includes(normalize(candidate)),
    );
    if (phrase) {
      earnedWeight += criterion.weight;
      matchedCriteria.push({
        id: criterion.id,
        label: criterion.label,
        evidence: getEvidence(text, normalizedText, phrase),
        mandatory: criterion.mandatory,
      });
    } else {
      missingCriteria.push(criterion.label);
    }
  }

  const score = Math.round((earnedWeight / totalWeight) * 100);
  const missingMandatory = rubric.criteria.some(
    (criterion) =>
      criterion.mandatory &&
      !matchedCriteria.some((matched) => matched.id === criterion.id),
  );

  return screeningResultSchema.parse({
    outcome: !missingMandatory && score >= rubric.threshold ? "advance" : "not_advance",
    score,
    matchedCriteria,
    missingCriteria,
    warnings: parserWarnings,
  });
}

