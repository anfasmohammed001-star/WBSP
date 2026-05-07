'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MoreHorizontal, Phone, Video, Paperclip, Send, Smile, Plus } from 'lucide-react';

export default function CustomerChatPage() {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    const messages = [
        {
            id: 1,
            sender: 'Mario S.',
            text: "Hi! I can definitely help with the plumbing issue. Could you send a photo of the leak?",
            time: '10:42 AM',
            isMe: false,
            avatar: 'https://ui-avatars.com/api/?name=Mario+S&background=0D8ABC&color=fff'
        },
        {
            id: 2,
            sender: 'Me',
            text: "Sure, give me a second.",
            time: '10:43 AM',
            isMe: true,
            avatar: null
        },
        {
            id: 3,
            sender: 'Me',
            image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=600',
            time: '10:44 AM',
            isMe: true,
            avatar: null
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col pb-24">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 px-4 py-3 flex items-center justify-between border-b border-slate-100 shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ChevronLeft className="h-6 w-6 text-slate-700" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <img src="https://ui-avatars.com/api/?name=Mario+S&background=0D8ABC&color=fff" className="w-10 h-10 rounded-full" />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div>
                            <h1 className="font-bold text-slate-900 leading-tight">Mario S.</h1>
                            <p className="text-xs text-slate-500 font-medium">Plumbing Expert • Online</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
                        <Phone className="h-5 w-5" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
                        <MoreHorizontal className="h-5 w-5" />
                    </button>
                </div>
            </header>

            {/* Chat Area */}
            <main className="flex-1 p-4 space-y-6">
                {/* Date Divider */}
                <div className="flex justify-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full">Today</span>
                </div>

                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                        {!msg.isMe && (
                            <img src={msg.avatar!} className="w-8 h-8 rounded-full self-end mb-1 shadow-sm" />
                        )}
                        <div className={`max-w-[80%] space-y-1 ${msg.isMe ? 'items-end flex flex-col' : ''}`}>
                            <div className={`
                                px-4 py-3 shadow-sm text-sm font-medium
                                ${msg.isMe
                                    ? 'bg-blue-600 text-white rounded-2xl rounded-br-sm'
                                    : 'bg-white text-slate-800 border border-slate-100 rounded-2xl rounded-bl-sm'}
                             `}>
                                {msg.image && (
                                    <div className="mb-2 rounded-lg overflow-hidden">
                                        <img src={msg.image} className="w-full h-auto" />
                                    </div>
                                )}
                                {msg.text}
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold px-1">{msg.time}</span>
                        </div>
                    </div>
                ))}
            </main>

            {/* Input Area */}
            <div className="bg-white border-t border-slate-100 p-4 sticky bottom-0 z-20 pb-safe">
                <div className="flex items-center gap-3">
                    <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
                        <Plus className="h-6 w-6" />
                    </button>
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="w-full h-12 bg-slate-50 border-transparent focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/10 rounded-2xl pl-4 pr-10 transition-all text-sm font-medium placeholder:text-slate-400"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                            <Smile className="h-6 w-6" />
                        </button>
                    </div>
                    <button className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                        <Send className="h-5 w-5 ml-0.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
