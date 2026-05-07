'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MoreVertical, Phone, Paperclip, Send, Mic, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WorkerChatPage() {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    const messages = [
        {
            id: 1,
            sender: 'Alex',
            text: "The electrical panel is in the laundry room behind the door. I've left the key with the concierge.",
            time: '10:24 AM',
            isMe: false,
            avatar: 'https://ui-avatars.com/api/?name=Alex+S&background=0D8ABC&color=fff'
        },
        {
            id: 2,
            sender: 'Me',
            text: "Found it. Checking the circuit breakers now for the living room area.",
            time: '10:28 AM',
            isMe: true,
            avatar: null
        },
        // Voice Note Example
        {
            id: 3,
            sender: 'Me',
            audio: "0:12",
            time: '10:30 AM',
            isMe: true,
            avatar: null
        }
    ];

    return (
        <div className="min-h-screen bg-[#020817] text-slate-200 flex flex-col pb-20">
            {/* Header */}
            <header className="bg-[#020817]/90 backdrop-blur-xl sticky top-0 z-50 px-4 py-3 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors text-slate-300">
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <img src="https://ui-avatars.com/api/?name=Alex+S&background=0D8ABC&color=fff" className="w-10 h-10 rounded-full ring-2 ring-[#020817]" />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#020817]"></div>
                        </div>
                        <div>
                            <h1 className="font-bold text-white leading-tight flex items-center gap-2">
                                Alex Rivera
                                <span className="bg-blue-500/20 text-blue-400 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">Client</span>
                            </h1>
                            <p className="text-xs text-slate-500 font-medium tracking-wide">Luxury Apt Repair • Active</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400">
                        <Phone className="h-5 w-5" />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400">
                        <MoreVertical className="h-5 w-5" />
                    </button>
                </div>
            </header>

            {/* Project Context Bar */}
            <div className="bg-white/5 px-4 py-2 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Job In Progress</span>
                </div>
                <button className="text-xs font-bold text-slate-400 hover:text-white underline">View Details</button>
            </div>

            {/* Chat Area */}
            <main className="flex-1 p-4 space-y-6 overflow-y-auto">
                <div className="flex justify-center">
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">Today</span>
                </div>

                {messages.map((msg) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={msg.id}
                        className={`flex gap-3 ${msg.isMe ? 'flex-row-reverse' : ''}`}
                    >
                        {!msg.isMe && (
                            <img src={msg.avatar!} className="w-8 h-8 rounded-full self-end mb-1 opacity-80" />
                        )}
                        <div className={`max-w-[85%] space-y-1 ${msg.isMe ? 'items-end flex flex-col' : ''}`}>
                            <div className={`
                                px-4 py-3 text-sm font-medium
                                ${msg.isMe
                                    ? 'bg-blue-600 text-white rounded-2xl rounded-br-sm shadow-lg shadow-blue-500/10'
                                    : 'bg-white/10 text-slate-200 border border-white/5 rounded-2xl rounded-bl-sm'}
                             `}>
                                {msg.text}
                                {msg.audio && (
                                    <div className="flex items-center gap-3 w-48">
                                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
                                            <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-0.5"></div>
                                        </div>
                                        <div className="flex-1 h-6 flex items-end gap-0.5 opacity-60">
                                            {[...Array(15)].map((_, i) => (
                                                <div key={i} className="w-1 bg-white rounded-full" style={{ height: `${20 + Math.random() * 80}%` }}></div>
                                            ))}
                                        </div>
                                        <span className="text-xs font-mono opacity-60">{msg.audio}</span>
                                    </div>
                                )}
                            </div>
                            <span className="text-[10px] text-slate-600 font-bold px-1">{msg.time}</span>
                        </div>
                    </motion.div>
                ))}
            </main>

            {/* Input Area */}
            <div className="bg-[#020817] border-t border-white/10 p-4 sticky bottom-0 z-20 pb-safe">
                <div className="flex items-center gap-3">
                    <button className="p-2 text-slate-500 hover:text-white transition-colors">
                        <Paperclip className="h-5 w-5" />
                    </button>
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Message..."
                            className="w-full h-12 bg-white/5 border border-white/10 focus:bg-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 rounded-2xl pl-4 pr-10 transition-all text-sm font-medium text-white placeholder:text-slate-600"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button className="absolute right-3 top-3 text-slate-500 hover:text-white transition-colors">
                            <Mic className="h-5 w-5" />
                        </button>
                    </div>
                    <button className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                        <Send className="h-5 w-5 ml-0.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
