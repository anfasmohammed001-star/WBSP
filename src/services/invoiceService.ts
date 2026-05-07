import { openai } from '../lib/openai';

export interface InvoiceItem {
    id: number;
    desc: string;
    amount: number;
}

export const invoiceService = {
    async parseInvoiceFromVoice(transcript: string): Promise<InvoiceItem[]> {
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: `You are an expert billing assistant for manual laborers. 
                        Given a transcript of a worker explaining the work done and costs, 
                        extract them into a list of billable items.
                        
                        Example input: "Fixed the bathroom leak which took 3 hours at 50 per hour, and bought a new faucet for 45 dollars."
                        Example output: 
                        [
                            {"id": 1, "desc": "Plumbing Labor (3 hrs)", "amount": 150},
                            {"id": 2, "desc": "New Bathroom Faucet", "amount": 45}
                        ]
                        
                        Return ONLY a JSON array of objects with keys: id, desc (string), amount (number).`
                    },
                    {
                        role: "user",
                        content: transcript
                    }
                ],
                response_format: { type: "json_object" }
            });

            const content = response.choices[0].message.content;
            if (!content) throw new Error('No response from AI');

            // The model is told to return an array, but response_format: json_object might wrap it.
            // Let's handle both.
            const parsed = JSON.parse(content);
            const items = Array.isArray(parsed) ? parsed : (parsed.items || Object.values(parsed)[0]);

            return items as InvoiceItem[];
        } catch (error) {
            console.error('Invoice Parsing Failed:', error);
            return [];
        }
    }
};
