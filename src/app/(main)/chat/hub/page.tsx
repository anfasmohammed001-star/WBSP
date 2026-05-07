'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Search,
    MessageSquare,
    User,
    Clock,
    CheckCircle2,
    ChevronRight,
    PlusCircle,
    Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';

interface Conversation {
    jobId: string;
    jobTitle: string;
    budget: number;
    participantId: string;
    participantName: string;
    participantAvatar: string;
    lastMessage?: string;
    lastMessageTime?: string;
    unreadCount: number;
    status: string;
}

export default function MessagingHub() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!user) return;

        const fetchConversations = async () => {
            try {
                // 1. Fetch relevant jobs (where user is customer or worker)
                const { data: jobs, error: jobsError } = await supabase
                    .from('jobs')
                    .select('*, customer:users!customer_id(*), worker:users!worker_id(*)')
                    .or(`customer_id.eq.${user.id},worker_id.eq.${user.id}`)
                    .not('worker_id', 'is', null) // Only show if worker is assigned
                    .order('updated_at', { ascending: false });

                if (jobsError) throw jobsError;

                // 2. For each job, get the last message
                const convos: Conversation[] = await Promise.all((jobs || []).map(async (job) => {
                    const participant = user.id === job.customer_id ? job.worker : job.customer;

                    const { data: lastMsg } = await supabase
                        .from('messages')
                        .select('*')
                        .eq('job_id', job.id)
                        .order('created_at', { ascending: false })
                        .limit(1)
                        .maybeSingle();

                    const { count: unread } = await supabase
                        .from('messages')
                        .select('*', { count: 'exact', head: true })
                        .eq('job_id', job.id)
                        .eq('recipient_id', user.id)
                        .eq('is_read', false);

                    return {
                        jobId: job.id,
                        jobTitle: job.title,
                        budget: job.budget,
                        participantId: participant.id,
                        participantName: participant.full_name,
                        participantAvatar: participant.avatar_url || `https://ui-avatars.com/api/?name=${participant.full_name}`,
                        lastMessage: lastMsg?.content,
                        lastMessageTime: lastMsg?.created_at,
                        unreadCount: unread || 0,
                        status: job.status
                    };
                }));

                setConversations(convos);
            } catch (err) {
                console.error("Failed to load conversations:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchConversations();
    }, [user]);

    const filteredConversations = conversations.filter(c =>
        c.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-background min-h-screen pb-24 text-foreground dark overflow-x-hidden">
            {/* Header */}
            <header className="p-6 flex flex-col gap-6 sticky top-0 bg-background/80 backdrop-blur-xl z-50 border-b border-border/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary/80 border border-border/50 hover:bg-secondary transition-all"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="text-xl font-black tracking-tight">Messages</h1>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Contact & Support</p>
                        </div>
                    </div>
                    <button className="h-10 w-10 flex items-center justify-center bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-all">
                        <PlusCircle className="h-5 w-5" />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search workers or jobs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-secondary/20 border border-border/50 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                    />
                </div>
            </header>

            <main className="p-4 space-y-4 max-w-2xl mx-auto">
                {isLoading ? (
                    <div className="space-y-4 pt-10">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-24 bg-secondary/20 rounded-[2rem] animate-pulse border border-border/30" />
                        ))}
                    </div>
                ) : filteredConversations.length === 0 ? (
                    <div className="py-20 text-center space-y-4">
                        <div className="h-20 w-20 bg-secondary/30 rounded-full flex items-center justify-center mx-auto opacity-20">
                            <MessageSquare className="h-10 w-10" />
                        </div>
                        <h3 className="text-lg font-black opacity-50 italic">No Conversations Found</h3>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">Active jobs will appear here once a worker is assigned.</p>
                        <button onClick={() => navigate('/jobs')} className="text-primary font-black uppercase text-xs tracking-widest hover:underline mt-4">Browse Marketplace</button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredConversations.map((convo, idx) => (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                key={convo.jobId}
                                onClick={() => navigate(`/chat?userId=${convo.participantId}&jobId=${convo.jobId}`)}
                                className="bg-card border border-border/50 rounded-[2rem] p-4 flex items-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group active:scale-[0.98]"
                            >
                                {/* Avatar */}
                                <div className="relative shrink-0">
                                    <div className="h-16 w-16 rounded-2xl overflow-hidden border border-border/50">
                                        <img src={convo.participantAvatar} alt={convo.participantName} className="h-full w-full object-cover" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full border-4 border-card" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 py-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-black text-sm tracking-tight text-foreground truncate">{convo.participantName}</h4>
                                        {convo.lastMessageTime && (
                                            <span className="text-[9px] font-bold text-muted-foreground uppercase">
                                                {formatDistanceToNow(new Date(convo.lastMessageTime), { addSuffix: true })}
                                            </span>
                                        )}
                                    </div>

                                    {/* Job Context Badge */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="bg-primary/10 px-2 py-0.5 rounded-lg flex items-center gap-1 shrink-0">
                                            <CheckCircle2 className="h-3 w-3 text-primary" />
                                            <span className="text-[10px] font-black text-primary uppercase tracking-wider">{convo.jobTitle}</span>
                                        </div>
                                        <span className="text-[10px] font-black text-green-500 tracking-tighter shrink-0">${convo.budget}</span>
                                    </div>

                                    <p className="text-xs font-medium text-muted-foreground truncate italic">
                                        {convo.lastMessage || 'No messages yet. Start the conversation!'}
                                    </p>
                                </div>

                                {/* Action / Unread */}
                                <div className="flex flex-col items-end gap-2 shrink-0">
                                    {convo.unreadCount > 0 && (
                                        <div className="h-5 w-5 bg-primary rounded-full flex items-center justify-center animate-bounce">
                                            <span className="text-[10px] font-black text-white">{convo.unreadCount}</span>
                                        </div>
                                    )}
                                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            {/* Quick Filter Section */}
            <div className="px-6 space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Quick Filters</h4>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {['All', 'Active Jobs', 'Completed', 'Unread'].map(filter => (
                        <button
                            key={filter}
                            className="shrink-0 px-5 py-2.5 rounded-xl bg-secondary/30 border border-border/50 text-[10px] font-black uppercase tracking-widest hover:border-primary/50 transition-all"
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
