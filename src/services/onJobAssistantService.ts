import { openai } from '../lib/openai';

export interface AssistantResponse {
    answer: string;
    safetyWarning?: string;
    quickTips: string[];
}

export const onJobAssistantService = {
    async getExpertHelp(query: string, jobCategory: string): Promise<AssistantResponse> {
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: `You are the WBSP On-Job Assistant. You provide expert technical advice to informal sector workers (plumbers, masons, etc.) who may have limited/improvisational tools.
                        
                        1. Provide a direct, practical answer.
                        2. ALWAYS include a safety warning if the task involves electricity, heights, or chemicals.
                        3. Provide 3 "Quick Tips" for efficiency.
                        
                        Tone: Professional, supportive, and practical.
                        
                        Return ONLY a JSON object:
                        {
                            "answer": "string",
                            "safetyWarning": "string",
                            "quickTips": ["string"]
                        }`
                    },
                    {
                        role: "user",
                        content: `CONTEXT: I am working as a ${jobCategory}. \nQUERY: ${query}`
                    }
                ],
                response_format: { type: "json_object" }
            });

            const content = response.choices[0].message.content;
            if (!content) throw new Error('No response from AI');

            return JSON.parse(content) as AssistantResponse;
        } catch (error) {
            console.error('Assistant Failed:', error);
            return {
                answer: "I'm having trouble connecting to the expert network. Please follow standard safety protocols.",
                quickTips: ["Check your connections", "Ensure tools are clean", "Verify measurements"]
            };
        }
    }
};
