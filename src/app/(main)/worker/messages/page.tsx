'use client';

import React, { useState } from 'react';
import { Search, MoreVertical, Filter, Phone, Video, Star, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function WorkerMessagesPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'clients' | 'support'>('clients');

    // TODO: Connect to Supabase/Dexie real messages
    const chats: any[] = [];
    /*
    const chats = [
        {
            id: 1,
            name: 'Alex Sterling',
            role: 'Premium Client',
            status: 'online',
            lastMsg: 'Is 2 PM still good for you?',
            time: '10:42 AM',
            unread: 1,
            avatar: 'https://ui-avatars.com/api/?name=Alex+S&background=0D8ABC&color=fff',
            project: 'Luxury Penthouse Staging'
        }, 
    ]; 
    */

    return (
        <div className="min-h-screen bg-[#020817] text-slate-200 pb-24">
            {/* Header */}
            <header className="px-6 pt-6 pb-2 sticky top-0 z-10 bg-[#020817]/90 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">Messages</h1>
                        <p className="text-xs text-slate-500 font-medium">You have {chats.filter(c => c.unread).length} unread conversations</p>
                    </div>
                    <button className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                        <MoreVertical className="w-5 h-5 text-slate-300" />
                    </button>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search clients..."
                        className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                    />
                </div>

                {/* Tabs */}
                <div className="flex gap-6 border-b border-white/5">
                    <button
                        onClick={() => setActiveTab('clients')}
                        className={cn(
                            "pb-3 text-sm font-bold transition-all relative",
                            activeTab === 'clients' ? "text-blue-400" : "text-slate-500 hover:text-slate-300"
                        )}
                    >
                        Active Clients
                        {activeTab === 'clients' && (
                            <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('support')}
                        className={cn(
                            "pb-3 text-sm font-bold transition-all relative",
                            activeTab === 'support' ? "text-blue-400" : "text-slate-500 hover:text-slate-300"
                        )}
                    >
                        WBSP Support
                        {activeTab === 'support' && (
                            <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full" />
                        )}
                    </button>
                </div>
            </header>

            {/* List */}
            <div className="p-4 space-y-3 mt-2">
                {chats.map(chat => (
                    <motion.div
                        key={chat.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(`/worker/messages/${chat.id}`)}
                        className={cn(
                            "p-4 rounded-3xl bg-white/5 border border-white/5 flex gap-4 cursor-pointer relative overflow-hidden group hover:bg-white/10 transition-all",
                            chat.unread ? "ring-1 ring-blue-500/30" : ""
                        )}
                    >
                        {/* Unread Indicator Effect */}
                        {chat.unread > 0 && (
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                        )}

                        <div className="relative">
                            <img src={chat.avatar} className="w-14 h-14 rounded-2xl object-cover" alt={chat.name} />
                            {chat.status === 'online' && (
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0f172a]" />
                            )}
                        </div>

                        <div className="flex-1 min-w-0 py-0.5">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold text-white text-base truncate">{chat.name}</h3>
                                <span className={chat.unread ? "text-xs font-bold text-blue-400" : "text-xs text-slate-500"}>{chat.time}</span>
                            </div>

                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                {chat.role === 'Premium Client' && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                                {chat.project}
                            </p>

                            <div className="flex justify-between items-center">
                                <p className={chat.unread ? "text-sm text-slate-200 font-medium truncate" : "text-sm text-slate-500 truncate"}>
                                    {chat.lastMsg}
                                </p>
                                {chat.unread > 0 && (
                                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                                        {chat.unread}
                                    </span>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
