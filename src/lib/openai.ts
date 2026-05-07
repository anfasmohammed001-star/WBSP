import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
    console.warn('Missing OpenAI API Key');
}

export const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // WE ARE ALLOWING THIS FOR DEMO ONLY. 
    // In production, all AI calls should go through a backend proxy to hide the key.
});
