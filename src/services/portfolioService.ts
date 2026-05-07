import { openai } from '../lib/openai';

export interface PortfolioAnalysis {
    title: string;
    description: string;
    skillsIdentified: string[];
    qualityScore: number; // 0-100
    highlightFeatures: string[];
}

export const portfolioService = {
    async analyzeWorkImage(imageUrl: string, jobCategory: string): Promise<PortfolioAnalysis> {
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: `You are a professional industrial recruiter and portfolio architect for the informal labor sector (WBSP). 
                        Analyze the image of a worker's completed project (e.g., a plumbed bathroom, a brick wall, a crafted chair).
                        
                        1. Generate a professional high-impact title.
                        2. Write a 2-sentence professional description highlighting the quality of work.
                        3. Identify 3-5 specific technical skills shown (e.g., "Precision Leveling", "PEX Tubing Mastery").
                        4. Give a "Quality Score" from 0-100 based on visible industry standards for ${jobCategory}.
                        5. List 2-3 specific features that highlight professional grade work.
                        
                        Return ONLY a JSON object with this structure:
                        {
                            "title": "string",
                            "description": "string",
                            "skillsIdentified": ["string"],
                            "qualityScore": number,
                            "highlightFeatures": ["string"]
                        }`
                    },
                    {
                        role: "user",
                        content: [
                            { type: "text", text: `Analyze my work as a ${jobCategory}.` },
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

            return JSON.parse(content) as PortfolioAnalysis;
        } catch (error) {
            console.error('Portfolio Analysis Failed:', error);
            return {
                title: `${jobCategory} Project`,
                description: "This project demonstrates professional execution and attention to detail.",
                skillsIdentified: [jobCategory],
                qualityScore: 85,
                highlightFeatures: ["Professional finish", "Reliable execution"]
            };
        }
    }
};
