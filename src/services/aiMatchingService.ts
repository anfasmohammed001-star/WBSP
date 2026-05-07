import { openai } from '../lib/openai';
import type { Job } from '../types';

export const aiMatchingService = {
    async matchWorkersToJob(job: Job, workers: any[]) { // workers should be typed properly in real app
        try {
            const workerSummaries = workers.map(w =>
                `ID: ${w.id}, Name: ${w.full_name}, Skills: ${w.skills?.join(', ')}, Rating: ${w.average_rating}, Bio: ${w.bio}`
            ).join('\n---\n');

            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: `You are an expert job-worker matching system. Rank the workers for the job.
            
            Job Title: ${job.title}
            Job Description: ${job.description}
            
            Return a JSON object with a key "matches" which is an array of objects containing:
            - workerId: The ID of the worker
            - matchScore: 0-100 score
            - reasoning: Brief explanation why they match`
                    },
                    {
                        role: "user",
                        content: `Workers List:\n${workerSummaries}`
                    }
                ],
                response_format: { type: "json_object" }
            });

            return JSON.parse(response.choices[0].message.content || '{"matches": []}');
        } catch (error) {
            console.error('AI Matching Failed:', error);
            return { matches: [] };
        }
    }
};
