import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft, Users, MessageSquare, Calendar,
    Trophy, Heart, Share2, MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Community() {
    const navigate = useNavigate();

    const posts = [
        {
            id: 1,
            author: "Sarah J.",
            role: "Interior Designer",
            avatar: "https://ui-avatars.com/api/?name=Sarah+J&background=10B981&color=fff",
            time: "2h ago",
            content: "Just finished a huge renovation in Pacific Heights! The client wanted a complete overhaul of their living room. Check out these before and afters! 🏠✨",
            image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800",
            likes: 124,
            comments: 18
        },
        {
            id: 2,
            author: "Mario S.",
            role: "Master Plumber",
            avatar: "https://ui-avatars.com/api/?name=Mario+S&background=0D8ABC&color=fff",
            time: "5h ago",
            content: "Anyone else dealing with the new supply chain delays for copper pipes? Prices are skyrocketing! 📉🔧",
            likes: 45,
            comments: 32
        }
    ];

    return (
        <div className="min-h-screen bg-[#020817] text-white pb-24 font-sans">
            {/* Header */}
            <div className="bg-[#0f172a] border-b border-white/5 sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors text-slate-400"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        Community
                        <Users className="w-5 h-5 text-blue-500" />
                    </h1>
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-lg shadow-blue-500/20">
                    New Post
                </button>
            </div>

            {/* Featured Events / Hall of Fame */}
            <div className="px-6 py-6 overflow-x-auto no-scrollbar flex gap-4">
                <div className="min-w-[280px] h-40 rounded-2xl relative overflow-hidden group cursor-pointer border border-white/5">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-600/90 to-amber-900/90 mix-blend-multiply z-10"></div>
                    <img src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&q=80&w=600" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 z-20 p-5 flex flex-col justify-between">
                        <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center text-white">
                            <Trophy className="w-4 h-4" />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-amber-200 uppercase tracking-wider mb-1 block">Hall of Fame</span>
                            <h3 className="text-lg font-black text-white leading-tight">Top Pros of October</h3>
                        </div>
                    </div>
                </div>

                <div className="min-w-[280px] h-40 rounded-2xl relative overflow-hidden group cursor-pointer border border-white/5">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-900/90 mix-blend-multiply z-10"></div>
                    <img src="https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=600" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 z-20 p-5 flex flex-col justify-between">
                        <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center text-white">
                            <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1 block">Upcoming Workshop</span>
                            <h3 className="text-lg font-black text-white leading-tight">Tax Prep for Freelancers</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feed */}
            <div className="px-6 space-y-6">
                <h2 className="text-lg font-bold text-white mb-2">My Feed</h2>
                {posts.map(post => (
                    <div key={post.id} className="bg-[#0f172a] border border-white/5 rounded-3xl overflow-hidden mb-6">
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img src={post.avatar} className="w-10 h-10 rounded-xl" />
                                <div>
                                    <h3 className="font-bold text-white text-sm">{post.author}</h3>
                                    <p className="text-xs text-slate-500">{post.role} • {post.time}</p>
                                </div>
                            </div>
                            <button className="text-slate-500 hover:text-white">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="px-4 pb-3">
                            <p className="text-slate-300 text-sm leading-relaxed mb-3">{post.content}</p>
                        </div>

                        {post.image && (
                            <div className="w-full h-64 bg-slate-900">
                                <img src={post.image} className="w-full h-full object-cover" />
                            </div>
                        )}

                        <div className="p-4 flex items-center justify-between border-t border-white/5 mt-2">
                            <div className="flex gap-4">
                                <button className="flex items-center gap-2 text-slate-400 hover:text-pink-500 transition-colors group">
                                    <Heart className="w-5 h-5 group-hover:fill-current" />
                                    <span className="text-xs font-bold">{post.likes}</span>
                                </button>
                                <button className="flex items-center gap-2 text-slate-400 hover:text-blue-500 transition-colors">
                                    <MessageSquare className="w-5 h-5" />
                                    <span className="text-xs font-bold">{post.comments}</span>
                                </button>
                            </div>
                            <button className="text-slate-400 hover:text-white">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
