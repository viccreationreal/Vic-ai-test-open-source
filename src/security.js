// =======================================================
//  SECURITY & SAFETY ENGINE (V1) — for open-source VicAI
// =======================================================
// This module protects your AI from harmful inputs,
// illegal requests, exploits, spam, and prompt injection.
//

export function securityCheck(userInput) {
  
  const input = (userInput || "").toLowerCase();

  // ==============================
  // 1. Hard illegal content block
  // ==============================
  const illegalKeywords = [
    "make a bomb",
    "build a weapon",
    "ddos",
    "hack",
    "ddos attack",
    "malware",
    "virus",
    "ransomware",
    "botnet",
    "kill",
    "hurt someone",
    "shoot",
    "bypass payment",
    "credit card generator",
    "carding"
  ];

  for (const key of illegalKeywords) {
    if (input.includes(key)) {
      return {
        allowed: false,
        reason: "Illegal or dangerous activity detected.",
        sanitizedInput: null
      };
    }
  }

  // =================================
  // 2. Prevent prompt-injection attacks
  // =================================
  if (
    input.includes("ignore previous instructions") ||
    input.includes("act as") ||
    input.includes("you are no longer an ai") ||
    input.includes("disable safety") ||
    input.includes("override")
  ) {
    return {
      allowed: false,
      reason: "Prompt injection attempt blocked.",
      sanitizedInput: null
    };
  }

  // ==============================
  // 3. Removing unsafe characters
  // ==============================
  const sanitized = userInput
    .replace(/<script>/gi, "")
    .replace(/<\/script>/gi, "")
    .replace(/[{}$`]/g, "");

  // ==============================
  // 4. Throttle keywords
  // ==============================
  const spammy = ["repeat", "spam", "overload", "crash system"];
  for (const s of spammy) {
    if (input.includes(s)) {
      return {
        allowed: false,
        reason: "Spam or malicious overload prevented.",
        sanitizedInput: null
      };
    }
  }

  // Everything is safe ✔️
  return {
    allowed: true,
    reason: "Safe",
    sanitizedInput: sanitized
  };
}
