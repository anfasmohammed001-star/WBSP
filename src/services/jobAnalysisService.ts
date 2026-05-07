import { openai } from '../lib/openai';

export const jobAnalysisService = {
    async analyzeJobDescription(description: string) {
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: `You are a job categorization expert. Analyze the job description and return a JSON object with:
            - category: Primary job category (e.g., Plumbing, Electrical, Cleaning)
            - skills: Array of 3-5 key skills required
            - difficulty: Beginner, Intermediate, Advanced, or Expert
            - estimatedRate: Suggested hourly rate range (e.g., "$40-$60")
            - urgency: Low, Medium, High, or Critical based on keywords`
                    },
                    {
                        role: "user",
                        content: description
                    }
                ],
                response_format: { type: "json_object" }
            });

            return JSON.parse(response.choices[0].message.content || '{}');
        } catch (error) {
            console.error('AI Analysis Failed:', error);
            // Fallback default
            return {
                category: 'General',
                skills: [],
                difficulty: 'Unknown',
                estimatedRate: 'Negotiable',
                urgency: 'Medium'
            };
        }
    }
};
