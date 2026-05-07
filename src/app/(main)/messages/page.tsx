'use client';

import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, MoreHorizontal, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Messages() {
    const navigate = useNavigate();

    const chats = [
        { id: 1, name: 'Mario S.', service: 'Plumbing Repair', lastMsg: 'I will be there in 10 mins.', time: '10:42 AM', unread: 2, avatar: 'https://ui-avatars.com/api/?name=Mario+S&background=0D8ABC&color=fff', active: true },
        { id: 2, name: 'Sarah Jenkins', service: 'Home Cleaning', lastMsg: 'Thanks for the review!', time: 'Yesterday', unread: 0, avatar: 'https://ui-avatars.com/api/?name=Sarah+J&background=10B981&color=fff', active: false },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-24">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 px-6 py-4 flex items-center justify-between border-b border-slate-100 shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ChevronLeft className="h-6 w-6 text-slate-700" />
                    </button>
                    <h1 className="text-xl font-bold">Messages</h1>
                </div>
                <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <MoreHorizontal className="h-6 w-6 text-slate-700" />
                </button>
            </header>

            {/* Search */}
            <div className="px-6 py-4">
                <div className="relative">
                    <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search chats or workers..."
                        className="w-full h-12 pl-12 pr-4 rounded-2xl bg-white border border-slate-100 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 placeholder:text-slate-400 text-sm font-medium transition-all"
                    />
                </div>
            </div>

            {/* Chat List */}
            <div className="px-6 space-y-3">
                {chats.map((chat) => (
                    <motion.div
                        key={chat.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(`/messages/${chat.id}`)}
                        className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md transition-all relative overflow-hidden"
                    >
                        {chat.unread > 0 && (
                            <div className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full m-3" />
                        )}

                        <div className="relative flex-shrink-0">
                            <img src={chat.avatar} alt={chat.name} className="w-14 h-14 rounded-2xl object-cover shadow-sm bg-slate-100" />
                            {chat.active && (
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-0.5">
                                <h3 className="font-bold text-base text-slate-900 truncate pr-2">{chat.name}</h3>
                                <span className={chat.unread > 0 ? "text-[11px] font-bold text-blue-600 whitespace-nowrap" : "text-[11px] font-medium text-slate-400 whitespace-nowrap"}>
                                    {chat.time}
                                </span>
                            </div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">{chat.service}</p>
                            <p className={chat.unread > 0 ? "text-sm font-bold text-slate-800 truncate" : "text-sm font-medium text-slate-500 truncate"}>
                                {chat.lastMsg}
                            </p>
                        </div>
                    </motion.div>
                ))}

                {/* Empty State / Old Messages */}
                <div className="pt-8 text-center opacity-60">
                    <p className="text-sm font-medium text-slate-400">All caught up!</p>
                </div>
            </div>
        </div>
    );
}
