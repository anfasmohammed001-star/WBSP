import { openai } from '../lib/openai';

export const reviewAnalysisService = {
    async analyzeReview(reviewText: string, rating: number) {
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: `Analyze the review. Return JSON with:
            - sentiment: Positive, Neutral, Negative
            - themes: Array of key themes (e.g., Punctuality, Quality)
            - isAbusive: boolean (true if contains hate speech/threats)
            - summary: One sentence summary`
                    },
                    {
                        role: "user",
                        content: `Rating: ${rating}/5\nReview: "${reviewText}"`
                    }
                ],
                response_format: { type: "json_object" }
            });

            return JSON.parse(response.choices[0].message.content || '{}');
        } catch (error) {
            console.error('Review Analysis Failed:', error);
            return { sentiment: 'Neutral', themes: [], isAbusive: false, summary: '' };
        }
    }
};
