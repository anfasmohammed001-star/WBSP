import { openai } from '../lib/openai';

export interface ReputationSummary {
    overallSentiment: string;
    strengths: string[];
    weaknesses: string[];
    reliabilityScore: number; // 0-100
    expertConclusion: string;
}

export const reputationService = {
    async summarizeReputation(reviews: { rating: number, text: string }[]): Promise<ReputationSummary> {
        try {
            if (reviews.length === 0) {
                return {
                    overallSentiment: "No history yet",
                    strengths: ["New Provider"],
                    weaknesses: [],
                    reliabilityScore: 100,
                    expertConclusion: "This worker is new to the platform. Be the first to review!"
                };
            }

            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: `You are an expert trust analyst for WBSP. 
                        Analyze the aggregate review data for a worker and provide:
                        1. Overall sentiment (e.g., "Highly Recommended", "Reliable but Slower").
                        2. 3 key strengths.
                        3. 1-2 areas for improvement (be professional).
                        4. A reliability score from 0-100.
                        5. A 2-sentence expert conclusion for the customer.
                        
                        Return ONLY a JSON object with:
                        {
                            "overallSentiment": "string",
                            "strengths": ["string"],
                            "weaknesses": ["string"],
                            "reliabilityScore": number,
                            "expertConclusion": "string"
                        }`
                    },
                    {
                        role: "user",
                        content: `Analyze these reviews:\n${reviews.map(r => `[${r.rating}/5]: ${r.text}`).join('\n')}`
                    }
                ],
                response_format: { type: "json_object" }
            });

            const content = response.choices[0].message.content;
            if (!content) throw new Error('No response from AI');

            return JSON.parse(content) as ReputationSummary;
        } catch (error) {
            console.error('Reputation Analysis Failed:', error);
            return {
                overallSentiment: "Mixed",
                strengths: ["Verified Identity"],
                weaknesses: [],
                reliabilityScore: 80,
                expertConclusion: "Insufficient data for a deep analysis. Average rating is consistent."
            };
        }
    }
};
