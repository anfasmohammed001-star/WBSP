'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Phone, Video, ChevronLeft, Mic, Play, Pause, CheckCircle2, Lock, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { chatService, ChatMessage } from '@/services/chatService';
import { supabase } from '@/lib/supabase';

export default function Chat() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user } = useAuth();

    // Recipient can be from URL param or derived from most recent job
    const recipientIdFromUrl = searchParams.get('userId');
    const jobIdFromUrl = searchParams.get('jobId');

    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isAvailable, setIsAvailable] = useState(false);
    const [loading, setLoading] = useState(true);
    const [availabilityReason, setAvailabilityReason] = useState('');
    const [recipient, setRecipient] = useState<any>(null);
    const [activeJob, setActiveJob] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        if (!user) return;

        const checkContext = async () => {
            try {
                let currentRecipientId = recipientIdFromUrl;
                let currentJobId = jobIdFromUrl;

                // 1. If no recipient in URL, find the active job
                if (!currentRecipientId || !currentJobId) {
                    const { data: jobs } = await supabase
                        .from('jobs')
                        .select('*, customer:users!customer_id(*), worker:users!worker_id(*)')
                        .or(`customer_id.eq.${user.id},worker_id.eq.${user.id}`)
                        .in('status', ['assigned', 'in_progress'])
                        .order('updated_at', { ascending: false })
                        .limit(1);

                    if (jobs?.[0]) {
                        const job = jobs[0];
                        setActiveJob(job);
                        currentJobId = job.id;
                        currentRecipientId = user.id === job.customer_id ? job.worker_id : job.customer_id;
                    }
                }

                if (!currentRecipientId) {
                    setIsAvailable(false);
                    setAvailabilityReason('No active conversation found');
                    setLoading(false);
                    return;
                }

                // 2. Fetch Recipient Profile
                const { data: recProfile } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', currentRecipientId)
                    .single();

                setRecipient(recProfile);

                // 3. Fetch Job context if available
                if (currentJobId && !activeJob) {
                    const { data: job } = await supabase
                        .from('jobs')
                        .select('*')
                        .eq('id', currentJobId)
                        .single();
                    setActiveJob(job);
                }

                // 4. Initial Messages Fetch
                const history = await chatService.getMessages(currentRecipientId, currentJobId || undefined);
                setMessages(history.map((m: any) => ({
                    id: m.id,
                    text: m.content,
                    sender: m.sender_id === user.id ? 'me' : 'them',
                    time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                })));

                setIsAvailable(true);

                // 5. Subscription
                const sub = chatService.subscribeToMessages((newMsg) => {
                    const isRelevantUser = (newMsg.sender_id === currentRecipientId && newMsg.recipient_id === user.id) ||
                        (newMsg.sender_id === user.id && newMsg.recipient_id === currentRecipientId);

                    const isRelevantJob = !currentJobId || newMsg.job_id === currentJobId;

                    if (isRelevantUser && isRelevantJob) {
                        setMessages(prev => {
                            // Deduplicate
                            if (prev.find(p => p.id === newMsg.id)) return prev;
                            return [...prev, {
                                id: newMsg.id,
                                text: newMsg.content,
                                sender: newMsg.sender_id === user.id ? 'me' : 'them',
                                time: new Date(newMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            }];
                        });
                    }
                });

                return () => {
                    supabase.removeChannel(sub);
                };

            } catch (error) {
                console.error("Chat setup failed:", error);
                setIsAvailable(false);
                setAvailabilityReason('Error loading chat session');
            } finally {
                setLoading(false);
            }
        };

        checkContext();
    }, [user, recipientIdFromUrl, jobIdFromUrl]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isAvailable]);

    const handleSend = async () => {
        if (!input.trim() || !user || !recipient) return;

        const textToSend = input;
        setInput('');

        try {
            await chatService.sendMessage(
                activeJob?.id,
                user.id,
                recipient.id,
                textToSend
            );
            // State update handled by subscription
        } catch (err) {
            console.error("Failed to send message:", err);
            // Optionally revert UI or show error
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background text-foreground">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isAvailable) {
        return (
            <div className="flex flex-col h-[calc(100vh-64px)] bg-background text-foreground max-w-md mx-auto shadow-2xl overflow-hidden border-x border-border relative">
                <div className="px-6 py-4 flex items-center space-x-4 border-b border-border">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-secondary hover:bg-secondary/80">
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <h3 className="font-bold">Chat</h3>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
                    <div className="h-24 w-24 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
                        <Lock className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h2 className="text-2xl font-black text-foreground">Chat Restricted</h2>
                    <p className="text-muted-foreground font-medium max-w-xs">{availabilityReason || 'You need an active job to chat with workers.'}</p>

                    <Button variant="premium" onClick={() => navigate('/dashboard')} className="w-full rounded-xl">
                        Return to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-background text-foreground transition-colors duration-300 max-w-md mx-auto shadow-2xl overflow-hidden border-x border-border">
            {/* Job Context Header */}
            {activeJob && (
                <div className="bg-primary/5 px-6 py-3 flex justify-between items-center border-b border-primary/10">
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black tracking-widest uppercase text-primary/60">Current Job Context</h4>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-bold text-foreground truncate max-w-[120px]">{activeJob.title}</span>
                                <span className="text-sm font-black text-primary">${activeJob.budget}</span>
                            </div>
                        </div>
                    </div>
                    <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline" onClick={() => navigate(`/tracking/${activeJob.id}`)}>Track Job</button>
                </div>
            )}

            {/* Main Header */}
            <div className="px-6 py-4 flex items-center justify-between bg-card border-b border-border shrink-0">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                    </button>
                    <div className="relative">
                        <div className="h-12 w-12 rounded-2xl overflow-hidden border border-border">
                            <img src={recipient?.avatar_url || `https://ui-avatars.com/api/?name=${recipient?.full_name}`} alt={recipient?.full_name} className="h-full w-full object-cover" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-card" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black tracking-tight text-foreground">{recipient?.full_name}</h3>
                        <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Online</p>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button className="p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors">
                        <Video className="h-5 w-5 text-muted-foreground" />
                    </button>
                    <button className="p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-8 bg-background no-scrollbar"
            >
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground/30 space-y-4">
                        <Lock className="h-12 w-12" />
                        <p className="text-xs font-bold uppercase tracking-widest">End-to-end Encrypted</p>
                    </div>
                ) : messages.map((m) => (
                    <div key={m.id} className={cn("flex w-full", m.sender === 'me' ? "justify-end" : "justify-start")}>
                        <div className={cn("max-w-[85%] space-y-1", m.sender === 'me' ? "items-end" : "items-start")}>
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className={cn(
                                    "px-5 py-3 rounded-3xl text-sm font-medium leading-relaxed shadow-sm",
                                    m.sender === 'me'
                                        ? "bg-primary text-primary-foreground rounded-tr-none shadow-primary/20"
                                        : "bg-card border border-border text-foreground rounded-tl-none"
                                )}
                            >
                                <p>{m.text}</p>
                            </motion.div>
                            <div className={cn("text-[10px] font-bold px-1", m.sender === 'me' ? "text-primary/60" : "text-muted-foreground")}>
                                {m.time}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-card border-t border-border shrink-0">
                <div className="flex items-center space-x-3 bg-secondary/50 rounded-3xl px-4 py-2 border border-border">
                    <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                        <Paperclip className="h-5 w-5" />
                    </button>
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-foreground placeholder:text-muted-foreground h-12"
                    />
                    <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                        <Mic className="h-5 w-5" />
                    </button>
                    <Button
                        size="icon"
                        onClick={handleSend}
                        className="h-10 w-10 shrink-0 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    >
                        <Send className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Bottom Safe Area */}
            <div className="h-6 shrink-0" />
        </div>
    );
}

