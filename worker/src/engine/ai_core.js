import { formatText } from "../utils/format.js";

export const AICore = {
    async chat(prompt, personality, memory) {
        // Basic rule-based generation with personality adjustments
        const { verbosity, humor, speedMode } = personality;

        let response = "";

        // 🧠 Use memory to keep context
        const memoryContext = memory.map(m => `User: ${m.user}\nAI: ${m.ai}`).join("\n");

        response += generateChatResponse(prompt, memoryContext, verbosity, humor);

        // 🕒 Adjust pacing (simulated)
        if (speedMode === "slow_safe") {
            response = response.slice(0, 300);
        }

        return formatText(response);
    },

    async code(prompt, personality, memory) {
        const { verbosity } = personality;

        let detailLevel = verbosity === "high" ? "detailed" : "simple";

        const response = generateCodeResponse(prompt, detailLevel);

        return formatText(response);
    }
};


// ------------------------
// CHAT GENERATION LOGIC
// ------------------------
function generateChatResponse(prompt, memoryContext, verbosity, humor) {
    let base = "";

    // Use memory
    if (memoryContext.length > 0) {
        base += "Based on earlier: " + memoryContext.slice(0, 200) + "\n\n";
    }

    // Main generation
    base += "Okay here’s what I think: ";

    if (verbosity === "high") base += "Let’s break it down in a clear and detailed way. ";
    if (verbosity === "low") base += "Quick answer: ";

    base += smartRespond(prompt);

    if (humor) base += " 😂";

    return base;
}


// ------------------------
// CODE GENERATION LOGIC
// ------------------------
function generateCodeResponse(prompt, detailLevel) {
    const p = prompt.toLowerCase();

    let base = "";

    if (p.includes("html")) {
        base += htmlTemplate();
    } else if (p.includes("api")) {
        base += apiTemplate();
    } else if (p.includes("cloudflare")) {
        base += workerTemplate();
    } else {
        base += "// Code requested, but domain unknown. Here’s a generic template.\n";
        base += genericTemplate();
    }

    if (detailLevel === "detailed") {
        base += "\n\n// Detailed explanation:\n";
        base += explainCode(base);
    }

    return base;
}


// ------------------------
// SMART CHAT LOGIC
// ------------------------
function smartRespond(prompt) {
    // Very simple simulation AI logic
    if (prompt.length < 5) return "Say more so I can help better!";

    if (prompt.includes("upgrade")) return "Alright upgrading this bad boi 🔥";

    if (prompt.includes("sad")) return "I'm here bro, talk to me.";

    return "Got you, here's what you need.";
}


// ------------------------
// CODE TEMPLATES
// ------------------------

function htmlTemplate() {
    return `
<!DOCTYPE html>
<html>
<head>
<title>Example</title>
</head>
<body>
<h1>Your HTML Project</h1>
</body>
</html>`;
}

function apiTemplate() {
    return `
export default {
  async fetch(request) {
    return new Response("API working!");
  }
};`;
}

function workerTemplate() {
    return `
export default {
  async fetch(request) {
    return new Response("Cloudflare Worker active!");
  }
};`;
}

function genericTemplate() {
    return `
function main() {
  console.log("Hello from your code!");
}`;
}


// ------------------------
// EXPLANATION GENERATOR
// ------------------------
function explainCode(code) {
    return "This code provides a basic structure and you can expand depending on your needs.";
}
