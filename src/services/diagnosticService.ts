import { openai } from '../lib/openai';

export interface DiagnosisResult {
    identifiedProblem: string;
    suggestedTools: string[];
    potentialParts: string[];
    estimatedComplexity: 'Simple' | 'Medium' | 'Complex';
    adviceForCustomer: string;
}

export const diagnosticService = {
    async diagnoseProblem(imageUrl: string, description?: string): Promise<DiagnosisResult> {
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: `You are an expert maintenance and repair consultant. 
                        Analyze the image provided by a customer of something that is broken (e.g., a toilet, a light fixture, a wall crack).
                        Your goal is to identify the problem and help the worker prepare for the job.
                        
                        Return ONLY a JSON object with:
                        {
                            "identifiedProblem": "Brief clear name of the problem",
                            "suggestedTools": ["List of 3-5 tools needed"],
                            "potentialParts": ["List of 2-3 specific replacement parts that might be needed"],
                            "estimatedComplexity": "Simple" | "Medium" | "Complex",
                            "adviceForCustomer": "One short tip for the customer while they wait for the worker"
                        }`
                    },
                    {
                        role: "user",
                        content: [
                            { type: "text", text: `I have a problem: ${description || "See image"}. What is it and what will the repair person need?` },
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

            return JSON.parse(content) as DiagnosisResult;
        } catch (error) {
            console.error('Diagnosis Failed:', error);
            return {
                identifiedProblem: "Undetermined Issue",
                suggestedTools: ["Basic Tool Kit", "Flashlight"],
                potentialParts: ["TBD after inspection"],
                estimatedComplexity: 'Medium',
                adviceForCustomer: "Please keep the area clear and take another photo from a different angle if possible."
            };
        }
    }
};
