import { openai } from '../lib/openai';

export interface CareerAdvice {
    recommendedPath: string;
    marketInsight: string;
    nextSteps: string[];
    earningPotential: string;
}

export const careerCoachService = {
    async getGrowthAdvice(currentSkills: string[], location: string): Promise<CareerAdvice> {
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: `You are the WBSP Career Growth Coach for manual and technical laborers. 
                        Your goal is to help workers upskill and increase their earning potential in the informal sector.
                        
                        1. Analyze their current skills.
                        2. Identify a "Next-Step Skill" that is in high demand (e.g., Solar for Electricians, Tiling for Masons).
                        3. Provide a market insight (e.g., "Demand for solar is up 40% in your city").
                        4. Provide 3 concrete next steps.
                        5. Estimate the earning potential increase.
                        
                        Return ONLY a JSON object:
                        {
                            "recommendedPath": "string",
                            "marketInsight": "string",
                            "nextSteps": ["string"],
                            "earningPotential": "string"
                        }`
                    },
                    {
                        role: "user",
                        content: `Skills: ${currentSkills.join(', ')}\nLocation: ${location}`
                    }
                ],
                response_format: { type: "json_object" }
            });

            const content = response.choices[0].message.content;
            if (!content) throw new Error('No response from AI');

            return JSON.parse(content) as CareerAdvice;
        } catch (error) {
            console.error('Career Coach Failed:', error);
            return {
                recommendedPath: "Specialist Certification",
                marketInsight: "Technical specialization consistently yields 25% higher rates.",
                nextSteps: ["Review Academy courses", "Connect with a mentor", "Update your portfolio"],
                earningPotential: "+15% YoY"
            };
        }
    }
};
