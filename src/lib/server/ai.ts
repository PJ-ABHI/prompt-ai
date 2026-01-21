import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '$env/dynamic/private';

const getGenAI = () => {
    const key = env.GEMINI_API_KEY;
    return key && key !== 'your_api_key_here' ? new GoogleGenerativeAI(key) : null;
};

export async function processPrompt(prompt: string, mode: string): Promise<string> {
    const apiKey = env.GEMINI_API_KEY;
    const genAI = getGenAI();

    console.log("DEBUG: Processing prompt with mode:", mode);
    console.log("DEBUG: GEMINI_API_KEY exists?", !!apiKey);
    // Do not log the full key for security, just length
    console.log("DEBUG: GEMINI_API_KEY length:", apiKey ? apiKey.length : 0);

    // Check if we have a valid API key
    if (genAI && apiKey && apiKey !== 'your_api_key_here') {
        const modelsToTry = ["gemini-1.5-flash", "gemini-pro"];

        for (const modelName of modelsToTry) {
            try {
                console.log(`DEBUG: Attempting generation with model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });

                let systemPrompt = "";
                switch (mode) {
                    case 'correct':
                        systemPrompt = "You are an expert prompt engineer. Your goal is to help the user refine their prompt to be more effective, clearer, and free of errors. Analyze their input, provide a corrected/improved version, and explain your changes.";
                        break;
                    case 'conversation':
                        systemPrompt = "You are an English language coach. Engage in a helpful conversation with the user, correcting their mistakes gently and asking follow-up questions to encourage practice.";
                        break;
                    default:
                        systemPrompt = "You are a helpful AI assistant.";
                }

                const result = await model.generateContent(`${systemPrompt}\n\nUser Input: ${prompt}`);
                const response = result.response;
                const text = response.text();
                console.log(`DEBUG: Generation successful with ${modelName}!`);
                return text;
            } catch (error: any) {
                console.warn(`DEBUG: Failed with model ${modelName}:`, error?.message || error);
                // Continue to the next model in the list
                if (modelName === modelsToTry[modelsToTry.length - 1]) {
                    console.error("DEBUG: All models failed.");
                }
            }
        }
    } else {
        console.log("DEBUG: Skipping Gemini. Key is default or missing.");
    }

    // Fallback: Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (!prompt.trim()) {
        return "Please provide a prompt.";
    }

    switch (mode) {
        case 'correct':
            return `[Refined Prompt]:\n${prompt} (Simulated Improvement)\n\n[Explanation]:\nI made your prompt clearer. (To use real AI, add GEMINI_API_KEY to .env)\n\nNote: If you have added the key, check the server console logs for '404' or other errors.`;
        case 'conversation':
            return `[Correction]:\n${prompt.replace(/\b(i is)\b/gi, 'I am').replace(/\b(she don't)\b/gi, "she doesn't")} (Simulated Correction)\n\n[Feedback]:\nREMEMBER: 'I' is always followed by 'am', not 'is'.\n\n[AI Reply]:\nThat's a good start! What else would you like to talk about today?\n\n(To use real AI, add GEMINI_API_KEY to .env)`;
        default:
            return `Processed: ${prompt}`;
    }
}
