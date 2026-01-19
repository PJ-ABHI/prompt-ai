export async function processPrompt(prompt: string, mode: string): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (!prompt.trim()) {
        return "Please provide a prompt.";
    }

    switch (mode) {
        case 'correct':
            return `[Corrected Version]:\n${prompt.replace(/\b(teh)\b/g, 'the').replace(/\b(wont)\b/g, "won't")} (Simulated AI Improvement)`;
        case 'email':
            return `Subject: Regarding your Request\n\nDear recipient,\n\n${prompt}\n\nBest regards,\n[Your Name]`;
        case 'description':
            return `Here is a compelling description based on "${prompt}":\n\nExperience the pinnacle of innovation with this groundbreaking concept. It seamlessly blends functionality with aesthetic perfection.`;
        case 'content':
            return `<h1>Generated Page Content</h1>\n<p>This is a simulated AI response for the prompt: "${prompt}".</p>\n<p>It includes structured HTML elements suitable for a webpage.</p>`;
        default:
            return `Processed: ${prompt}`;
    }
}
