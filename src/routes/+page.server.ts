import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { processPrompt } from '$lib/server/ai';

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const prompt = data.get('prompt')?.toString();
        const mode = data.get('mode')?.toString() || 'correct';

        if (!prompt) {
            return fail(400, { prompt, missing: true });
        }

        try {
            const result = await processPrompt(prompt, mode);
            return { success: true, result, prompt, mode };
        } catch (error) {
            return fail(500, { message: 'AI processing failed' });
        }
    }
} satisfies Actions;
