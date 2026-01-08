// =======================================================
// VicAI Text Utilities
// Cleans, normalizes, analyzes text safely and fast
// =======================================================

// Remove invisible Unicode characters (they cause crashes)
const INVISIBLE_CHARS =
  /[\u200B-\u200F\u202A-\u202E\u2060-\u2064\uFEFF]/g;

// Emojis: kept for chat, removed for classification
const EMOJI_REGEX =
  /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF][\uDC00-\uDFFF])/g;


// -------------------------------------------------------
// Clean input for classification (safe, stable)
// -------------------------------------------------------
export function sanitizeForAI(text) {
  if (!text) return "";

  return text
    .replace(INVISIBLE_CHARS, "")
    .replace(/<script.*?>.*?<\/script>/gi, "")  // script injection protection
    .replace(/\s+/g, " ")
    .trim();
}


// -------------------------------------------------------
// Remove emojis (for classifier only)
// -------------------------------------------------------
export function removeEmojis(text) {
  return text.replace(EMOJI_REGEX, "").trim();
}


// -------------------------------------------------------
// Heuristic: detect if user is asking for code
// -------------------------------------------------------
export function looksLikeCodeRequest(text) {
  const t = text.toLowerCase();

  return (
    t.includes("code") ||
    t.includes("function") ||
    t.includes("class") ||
    t.includes("script") ||
    t.includes("api endpoint") ||
    t.includes("write me") ||
    /```/.test(text) ||
    /(const|let|var)\s+[a-zA-Z]/.test(text) ||
    /def\s+[a-zA-Z]/.test(text)
  );
}


// -------------------------------------------------------
// Heuristic: detect teaching/explanation
// -------------------------------------------------------
export function looksLikeTeachingRequest(text) {
  const t = text.toLowerCase();

  return (
    t.includes("explain") ||
    t.includes("teach") ||
    t.includes("how does") ||
    t.includes("why does") ||
    t.includes("what is")
  );
}


// -------------------------------------------------------
// Smooth reply text (nice spacing, readable)
// -------------------------------------------------------
export function smoothText(text) {
  return text
    .replace(/\s+\./g, ".")
    .replace(/\s+,/g, ",")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
