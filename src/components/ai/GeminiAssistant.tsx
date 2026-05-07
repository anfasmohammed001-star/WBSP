import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, X, Minimize2, Lightbulb, User, TrendingUp, MapPin, Star, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import { useAuth } from '../../hooks/useAuth';
import { openai } from '../../lib/openai';
import { dashboardService } from '../../services/dashboardService';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    text: string;
    isStreaming?: boolean;
    attachment?: any; // For Cards
}

export default function GeminiAssistant() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            text: `Hi ${user?.fullName?.split(' ')[0] || 'there'}! I'm Gemini 3.0 Pro. I can help with smart recommendations, insights, and more.`
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Real Gemini/OpenAI Response Integration
    const generateResponse = async (userText: string) => {
        setIsTyping(true);
        const responseId = Date.now().toString();

        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: `You are Gemini Pro 3.0, the advanced AI assistant for WBSP (Worker Booking & Service Platform).
                        You help workers and customers navigate the platform.
                        
                        Context:
                        - User Role: ${user?.userType || 'Guest'}
                        - User Name: ${user?.fullName || 'User'}
                        
                        Capabilities:
                        1. Recommend Workers: If asked to find/recommend a professional.
                        2. Analyze Spending: If asked about budgets or spending trends.
                        3. Platform Tips: General usage advice.
                        
                        Tone: Professional, sleek, helpful, and concise.
                        
                        Special: If the user asks for spending analysis, mention you are accessing their secure ledger.`
                    },
                    {
                        role: "user",
                        content: userText
                    }
                ],
                stream: true,
            });

            let fullText = '';
            setMessages(prev => [...prev, { id: responseId, role: 'assistant', text: '', isStreaming: true }]);

            for await (const chunk of response) {
                const content = chunk.choices[0]?.delta?.content || '';
                if (content) {
                    fullText += content;
                    setMessages(prev => prev.map(m =>
                        m.id === responseId ? { ...m, text: fullText } : m
                    ));
                }
            }

            // After text is finished, check if we should attach a smart card
            const lowerText = userText.toLowerCase();
            let attachment = null;

            if (lowerText.includes('recommend') || lowerText.includes('worker') || lowerText.includes('find')) {
                attachment = {
                    type: 'worker_card',
                    data: {
                        name: 'Sarah Jenkins',
                        role: 'Elite Electrician',
                        rating: 4.9,
                        jobs: 142,
                        distance: '0.8 miles away',
                        image: 'https://i.pravatar.cc/150?u=sarah'
                    }
                };
            } else if ((lowerText.includes('spending') || lowerText.includes('trends') || lowerText.includes('analyze')) && user?.id) {
                const stats = await dashboardService.getCustomerStats(user.id);
                attachment = {
                    type: 'stats_card',
                    data: {
                        total: `$${stats.totalSpent.toFixed(2)}`,
                        trend: '+12%',
                        topCategory: 'General'
                    }
                };
            }

            setMessages(prev => prev.map(m =>
                m.id === responseId ? { ...m, isStreaming: false, attachment } : m
            ));

        } catch (e) {
            console.error('Gemini Failed:', e);
            setMessages(prev => [...prev, {
                id: responseId,
                role: 'assistant',
                text: "I'm having trouble connecting to my neural network. Please try again soon."
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSend = () => {
        if (!input.trim()) return;
        const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        generateResponse(input);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            <div className="pointer-events-auto">
                <AnimatePresence>
                    {isOpen && !isMinimized && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-card w-80 md:w-96 rounded-3xl shadow-2xl border border-border overflow-hidden mb-4 flex flex-col max-h-[600px]"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center justify-between text-white">
                                <div className="flex items-center space-x-2">
                                    <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-md">
                                        <Sparkles className="h-4 w-4 text-indigo-200" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm">Gemini Pro</h3>
                                        <p className="text-[10px] opacity-80 font-medium">Advanced AI Assistant</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <button onClick={() => setIsMinimized(true)} className="p-1 hover:bg-white/20 rounded-lg transition-colors"><Minimize2 className="h-4 w-4" /></button>
                                    <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-lg transition-colors"><X className="h-4 w-4" /></button>
                                </div>
                            </div>

                            {/* Chat Area */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/30 h-80 scrollbar-thin scrollbar-thumb-gray-300">
                                {messages.map((msg) => (
                                    <div key={msg.id} className={cn("flex w-full flex-col space-y-2", msg.role === 'user' ? "items-end" : "items-start")}>
                                        <div className={cn(
                                            "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                                            msg.role === 'user'
                                                ? "bg-primary text-primary-foreground rounded-tr-none"
                                                : "bg-white dark:bg-zinc-800 border border-border rounded-tl-none shadow-sm"
                                        )}>
                                            <p className="whitespace-pre-wrap">{msg.text}</p>
                                            {msg.isStreaming && <span className="inline-block w-1.5 h-4 ml-1 bg-current animate-pulse align-middle" />}
                                        </div>

                                        {/* Smart Attachments */}
                                        {msg.attachment && msg.role === 'assistant' && !msg.isStreaming && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="w-[85%]"
                                            >
                                                {msg.attachment.type === 'worker_card' && (
                                                    <div className="bg-white dark:bg-zinc-800 p-4 rounded-2xl border border-border shadow-md">
                                                        <div className="flex items-center space-x-3 mb-3">
                                                            <img src={msg.attachment.data.image} className="w-12 h-12 rounded-full object-cover" />
                                                            <div>
                                                                <h4 className="font-bold text-foreground">{msg.attachment.data.name}</h4>
                                                                <div className="flex items-center text-xs text-muted-foreground">
                                                                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
                                                                    {msg.attachment.data.rating} • {msg.attachment.data.jobs} Jobs
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center text-xs bg-secondary p-2 rounded-lg text-muted-foreground">
                                                            <MapPin className="h-3 w-3 mr-1" />
                                                            {msg.attachment.data.distance}
                                                        </div>
                                                        <Button size="sm" className="w-full mt-3 rounded-xl font-bold h-8 text-xs">View Profile</Button>
                                                    </div>
                                                )}

                                                {msg.attachment.type === 'stats_card' && (
                                                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl shadow-lg text-white relative overflow-hidden">
                                                        <div className="relative z-10">
                                                            <p className="text-xs font-medium opacity-80">Total Spending</p>
                                                            <h4 className="text-3xl font-black mt-1">{msg.attachment.data.total}</h4>
                                                            <div className="flex items-center mt-3 bg-white/20 w-fit px-2 py-1 rounded-lg text-xs font-bold">
                                                                <TrendingUp className="h-3 w-3 mr-1" />
                                                                {msg.attachment.data.trend} savings
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-white dark:bg-zinc-800 p-3 rounded-2xl rounded-tl-none border border-border shadow-sm flex space-x-1">
                                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Suggestions */}
                            {messages.length === 1 && (
                                <div className="bg-secondary/30 px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
                                    <button onClick={() => { setInput("Recommend a worker near me"); handleSend(); }} className="text-xs bg-white dark:bg-black/20 border border-border px-3 py-1.5 rounded-full whitespace-nowrap hover:border-primary transition-colors flex items-center">
                                        <User className="h-3 w-3 mr-1 text-blue-500" /> Recommend Worker
                                    </button>
                                    <button onClick={() => { setInput("Analyze my spending trends"); handleSend(); }} className="text-xs bg-white dark:bg-black/20 border border-border px-3 py-1.5 rounded-full whitespace-nowrap hover:border-primary transition-colors flex items-center">
                                        <TrendingUp className="h-3 w-3 mr-1 text-green-500" /> Spending Trends
                                    </button>
                                    <button onClick={() => { setInput("Suggest features"); handleSend(); }} className="text-xs bg-white dark:bg-black/20 border border-border px-3 py-1.5 rounded-full whitespace-nowrap hover:border-primary transition-colors flex items-center">
                                        <Lightbulb className="h-3 w-3 mr-1 text-yellow-500" /> Ideas
                                    </button>
                                </div>
                            )}

                            {/* Input Area */}
                            <div className="p-3 border-t border-border bg-card">
                                <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Ask Gemini..."
                                        className="flex-1 bg-secondary text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    />
                                    <Button type="submit" size="sm" className="rounded-xl h-10 w-10 p-0 flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 border-0" disabled={!input.trim() || isTyping}>
                                        <Send className="h-4 w-4 text-white" />
                                    </Button>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* FAB */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        if (isMinimized) setIsMinimized(false);
                        else setIsOpen(!isOpen);
                    }}
                    className={cn(
                        "h-14 w-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 relative group overflow-hidden",
                        isOpen && !isMinimized ? "bg-red-500 hover:bg-red-600" : "bg-black dark:bg-white"
                    )}
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10">
                        {isOpen && !isMinimized ? <X className="h-6 w-6 text-white" /> : <Sparkles className={cn("h-6 w-6", isOpen ? "text-white" : "text-white dark:text-black")} />}
                    </div>
                </motion.button>
            </div>
        </div>
    );
}
