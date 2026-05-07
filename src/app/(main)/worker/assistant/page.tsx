
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Send, Sparkles, Loader2, Lightbulb, AlertTriangle, CheckCircle2, Mic, Bot } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { onJobAssistantService, AssistantResponse } from '@/services/onJobAssistantService';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function OnJobAssistant() {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [response, setResponse] = useState<AssistantResponse | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const askAssistant = async () => {
        if (!query.trim()) return;
        setIsThinking(true);
        try {
            const res = await onJobAssistantService.getExpertHelp(query, "General Technical Work");
            setResponse(res);
            toast.success("Expert advice received");
        } catch (error) {
            toast.error("Could not reach the expert network");
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <div className="bg-[#020617] min-h-screen pb-20 text-slate-100 font-sans">
            <header className="p-4 flex items-center justify-between sticky top-0 bg-[#020617]/80 backdrop-blur-md z-20 border-b border-white/5">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-white/5 text-slate-400">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-2">
                    <Bot className="h-5 w-5 text-emerald-400" />
                    <h1 className="text-lg font-black tracking-tight uppercase">On-Job AI Assistant</h1>
                </div>
                <div className="w-10"></div>
            </header>

            <div className="p-6 space-y-8 max-w-md mx-auto">
                {!response && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-8 py-10"
                    >
                        <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-white/10 p-10 rounded-[2.5rem] flex flex-col items-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2rem] flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.3)] mb-8">
                                <Sparkles className="w-12 h-12 text-white" />
                            </div>
                            <h2 className="text-3xl font-black mb-3 leading-tight text-white">Ask for Expert Help</h2>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed">Describe a technical problem or ask for a workaround on-site. AI provides practical, safety-first advice.</p>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {[
                                "What mortar mix for wet brick?",
                                "Fix leaking pipe without wrench?",
                                "Safest way to drill into granite?"
                            ].map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => setQuery(q)}
                                    className="text-left bg-white/5 p-4 rounded-2xl border border-white/5 text-xs font-bold text-slate-300 hover:bg-white/10 transition-colors"
                                >
                                    "{q}"
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                <AnimatePresence>
                    {response && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6 pb-20"
                        >
                            <div className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="h-1 bg-emerald-500 w-12 rounded-full" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Expert Advice</p>
                                </div>
                                <p className="text-slate-200 text-sm leading-relaxed font-medium">{response.answer}</p>
                            </div>

                            {response.safetyWarning && (
                                <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-[2rem] flex items-start gap-4">
                                    <div className="bg-red-500 p-2 rounded-xl text-white shadow-lg shadow-red-500/20">
                                        <AlertTriangle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-1">Safety Critical</p>
                                        <p className="text-xs font-bold text-red-100 leading-tight">{response.safetyWarning}</p>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-4">Efficiency Tips</p>
                                <div className="grid grid-cols-1 gap-3">
                                    {response.quickTips.map((tip, i) => (
                                        <div key={i} className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                                            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                                            <span className="text-xs font-bold text-slate-300">{tip}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => { setResponse(null); setQuery(''); }}
                                className="w-full py-4 text-emerald-400 font-black text-xs uppercase tracking-widest text-center"
                            >
                                Ask Another Question
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Input Bar */}
            {!response && (
                <div className="fixed bottom-0 inset-x-0 p-4 bg-gradient-to-t from-[#020617] via-[#020617] to-transparent">
                    <div className="max-w-md mx-auto relative">
                        <textarea
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Type your question..."
                            className="w-full bg-[#0f172a] border border-white/10 rounded-[2rem] py-4 pl-6 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none min-h-[64px]"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    askAssistant();
                                }
                            }}
                        />
                        <button
                            disabled={isThinking || !query.trim()}
                            onClick={askAssistant}
                            className="absolute right-3 bottom-3 h-10 w-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                        >
                            {isThinking ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
