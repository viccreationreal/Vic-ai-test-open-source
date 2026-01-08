// =======================================================
// VicAI Classifier (Deep Heuristic Engine)
// Decides: "chat", "code", "teach", "unsafe", "unknown"
// =======================================================

import {
  sanitizeForAI,
  removeEmojis,
  looksLikeCodeRequest,
  looksLikeTeachingRequest
} from "./text.js";


// Keywords for unsafe detection
const UNSAFE_KEYWORDS = [
  "hack",
  "ddos",
  "break into",
  "exploit",
  "bypass login",
  "steal",
  "illegal",
  "leak",
  "pirated",
  "malware",
  "virus",
  "keylogger",
  "token grabber"
];


// -------------------------------------------------------
// Detect unsafe requests (no AI model needed)
// -------------------------------------------------------
function isUnsafe(text) {
  const t = text.toLowerCase();

  return UNSAFE_KEYWORDS.some(keyword => t.includes(keyword));
}


// -------------------------------------------------------
// MAIN CLASSIFIER FUNCTION
// -------------------------------------------------------
export function classify(cleanInput) {
  if (!cleanInput || cleanInput.length < 2) {
    return "chat";
  }

  // Remove emojis for cleaner detection
  const text = removeEmojis(cleanInput);

  // 1. Unsafe detection first
  if (isUnsafe(text)) {
    return "unsafe";
  }

  // 2. Code request detection
  if (looksLikeCodeRequest(text)) {
    return "code";
  }

  // 3. Teaching/explaining detection
  if (looksLikeTeachingRequest(text)) {
    return "teach";
  }

  // 4. If user is asking questions like a conversation
  if (/^[a-zA-Z0-9 ?!.,'"]{4,}$/.test(text)) {
    return "chat";
  }

  return "unknown";
}


// -------------------------------------------------------
// Convenience wrapper: clean + classify
// -------------------------------------------------------
export function analyzeInput(rawInput) {
  const sanitized = sanitizeForAI(rawInput || "");
  const type = classify(sanitized);

  return {
    raw: rawInput,
    clean: sanitized,
    type
  };
}
