'use client';

import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Send, Link, Copy, MessageSquare, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

export default function FeedbackRequest() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [copied, setCopied] = useState(false);
    const [clients, setClients] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchDoneJobs = async () => {
            try {
                // Fetch completed jobs where the worker is assigned
                const { data, error } = await supabase
                    .from('jobs')
                    .select('id, title, created_at, customer_id, customer:users!customer_id(full_name)')
                    .eq('worker_id', user.id)
                    .eq('status', 'completed')
                    .order('created_at', { ascending: false })
                    .limit(10);

                if (error) throw error;
                setClients(data || []);
            } catch (err) {
                console.error("Error fetching clients for review:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDoneJobs();
    }, [user]);

    const copyLink = () => {
        const link = `${window.location.origin}/profile/${user?.id}/review`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-background min-h-screen pb-20 text-foreground">
            <header className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-secondary">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <h1 className="text-lg font-black">Request Review</h1>
                </div>
                <div className="w-10"></div>
            </header>

            <div className="p-4 space-y-6">

                {/* Personal Link */}
                <div className="bg-card border border-border p-6 rounded-3xl text-center shadow-sm">
                    <h2 className="font-bold text-lg mb-2">Your Personal Review Link</h2>
                    <p className="text-xs text-muted-foreground mb-4">Share this link to collect reviews from past clients.</p>

                    <div className="flex items-center bg-secondary p-2 rounded-xl border border-border">
                        <div className="flex-1 text-xs font-mono text-muted-foreground truncate px-2">
                            {window.location.origin}/profile/{user?.id}/review
                        </div>
                        <button
                            onClick={copyLink}
                            className={cn("p-2 rounded-lg transition-colors", copied ? "bg-green-500 text-white" : "bg-white shadow-sm text-foreground hover:bg-gray-50")}
                        >
                            {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                {/* Recent Clients */}
                <div>
                    <h3 className="font-bold text-lg mb-3">Recent Clients</h3>
                    <div className="space-y-3">
                        {isLoading ? (
                            <p className="text-sm text-center text-muted-foreground">Loading clients...</p>
                        ) : clients.length > 0 ? clients.map(job => (
                            <div key={job.id} className="flex items-center justify-between p-4 bg-card border border-border rounded-2xl">
                                <div>
                                    <h4 className="font-bold text-sm">{job.customer?.full_name || 'Anonymous Client'}</h4>
                                    <p className="text-[10px] text-muted-foreground">{job.title} • {new Date(job.created_at).toLocaleDateString()}</p>
                                </div>
                                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary/90 flex items-center space-x-2">
                                    <Send className="h-3 w-3" />
                                    <span>Send Request</span>
                                </button>
                            </div>
                        )) : (
                            <div className="text-center py-6 bg-secondary/20 rounded-2xl border border-dashed border-border">
                                <p className="text-xs text-muted-foreground">No completed jobs yet to request reviews.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Preview */}
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white text-center">
                    <h3 className="font-black text-xl mb-2">Why collect reviews?</h3>
                    <p className="text-sm opacity-90 mb-4">Workers with 10+ reviews get hired 3x faster.</p>
                    <div className="flex justify-center -space-x-2">
                        {[1, 2, 3, 4].map(i => (
                            <img key={i} src={`https://i.pravatar.cc/150?u=${i}`} className="h-10 w-10 rounded-full border-2 border-indigo-500" />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

