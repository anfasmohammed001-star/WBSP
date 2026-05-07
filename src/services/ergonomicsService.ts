import { openai } from '../lib/openai';

export interface ErgonomicsAnalysis {
    assessment: string;
    riskLevel: 'Low' | 'Medium' | 'High';
    recommendations: string[];
    suggestedStretches: string[];
}

export const ergonomicsService = {
    async analyzePosture(imageUrl: string, jobCategory: string): Promise<ErgonomicsAnalysis> {
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: `You are an Occupational Health and Ergonomics Coach for physical laborers (e.g., masons, plumbers, cleaners, carpenters). 
                        Analyze the image of the worker's posture/workspace and provide:
                        1. A brief assessment of their current posture.
                        2. A risk level for potential injury (Low, Medium, High).
                        3. 3-4 specific recommendations to improve ergonomics.
                        4. 2-3 quick stretches suitable for their specific job category (${jobCategory}).
                        
                        Return ONLY a JSON object with this structure:
                        {
                            "assessment": "string",
                            "riskLevel": "Low" | "Medium" | "High",
                            "recommendations": ["string"],
                            "suggestedStretches": ["string"]
                        }`
                    },
                    {
                        role: "user",
                        content: [
                            { type: "text", text: `Analyze my working posture for my job as a ${jobCategory}.` },
                            {
                                type: "image_url",
                                image_url: {
                                    "url": imageUrl,
                                },
                            },
                        ],
                    }
                ],
                response_format: { type: "json_object" }
            });

            const content = response.choices[0].message.content;
            if (!content) throw new Error('No response from AI');

            return JSON.parse(content) as ErgonomicsAnalysis;
        } catch (error) {
            console.error('Ergonomics Analysis Failed:', error);
            return {
                assessment: "We couldn't analyze your posture right now. Please ensure you are in a well-lit area and your full body/working stance is visible.",
                riskLevel: 'Medium',
                recommendations: ["Maintain a straight back", "Take regular breaks", "Use proper lifting techniques"],
                suggestedStretches: ["Shoulder rolls", "Hamstring stretch"]
            };
        }
    }
};
