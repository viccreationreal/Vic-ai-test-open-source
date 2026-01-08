import { AICore } from "./engine/ai_core.js";
import { PersonalityEngine } from "./engine/personality.js";
import { IntentEngine } from "./engine/intent.js";
import { LegalEngine } from "./engine/legal.js";
import { MemorySystem } from "./engine/memory.js";
import { ZipEngine } from "./engine/zip.js";

export default {
    async fetch(request) {
        try {
            const data = await request.json();
            const prompt = data.prompt || "";
            const fileData = data.fileData || null;

            // 🧠 Mood detection (affects tone + style)
            const mood = PersonalityEngine.detectMood(prompt);
            const personalitySettings = PersonalityEngine.adjustSettings(mood);
            const prefix = PersonalityEngine.generatePrefix(mood);

            // ⚖️ Legal check
            const legalStatus = LegalEngine.check(prompt);
            if (!legalStatus.allowed) {
                return json({
                    error: true,
                    message: legalStatus.reason
                });
            }

            // 🔍 Intent detection (chat, code, analysis, zip, etc.)
            const intent = IntentEngine.detect(prompt, fileData);

            // 💾 Load previous memory (last 20 messages)
            const memory = MemorySystem.load();

            let result = "";

            // 📦 ZIP / file handling
            if (intent === "zip-analysis" && fileData) {
                result = await ZipEngine.analyze(fileData, personalitySettings);
            } 
            // 💻 Code generator
            else if (intent === "code") {
                result = await AICore.code(prompt, personalitySettings, memory);
            } 
            // 💬 Normal chat mode
            else {
                result = await AICore.chat(prompt, personalitySettings, memory);
            }

            // 📝 Save memory for context
            MemorySystem.save(prompt, result);

            return json({
                mood,
                intent,
                response: prefix + result
            });

        } catch (err) {
            return json({
                error: true,
                message: "Server error: " + err.message
            });
        }
    }
};


// Helper to return JSON properly
function json(obj) {
    return new Response(JSON.stringify(obj), {
        headers: { "Content-Type": "application/json" }
    });
}
