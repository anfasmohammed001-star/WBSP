'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MessageCircle, Heart, Share2, Plus, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function WorkerForum() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');

    const posts = [
        {
            id: 1,
            author: 'John Plumber',
            role: 'Expert',
            avatar: 'https://i.pravatar.cc/150?u=john',
            time: '2h ago',
            content: 'Found a great new wrench set that fits perfectly in tight spaces. Highly recommend for any HVAC pros out there! 🔧',
            likes: 24,
            comments: 5
        },
        {
            id: 2,
            author: 'Sarah Electric',
            role: 'Pro',
            avatar: 'https://i.pravatar.cc/150?u=sarah',
            time: '5h ago',
            content: 'Does anyone know the updated code for breaker box clearance in commercial units? Getting mixed info.',
            likes: 12,
            comments: 8
        },
        {
            id: 3,
            author: 'Mike Fixit',
            role: 'Newcomer',
            avatar: 'https://i.pravatar.cc/150?u=mike',
            time: '1d ago',
            content: 'Just completed my first 5-star job! Thanks for all the tips on customer communication guys, it really helped.',
            likes: 56,
            comments: 12
        }
    ];

    return (
        <div className="bg-background min-h-screen pb-20 text-foreground">
            {/* Header */}
            <header className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-secondary">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <h1 className="text-lg font-black">Community</h1>
                <div className="w-10"></div>
            </header>

            <div className="p-4">
                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search topics, tips, or questions..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-secondary border-none rounded-2xl h-12 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>

                {/* Filters */}
                <div className="flex space-x-2 overflow-x-auto pb-4 scrollbar-hide">
                    {['All', 'Tips', 'Questions', 'Success Stories', 'Events'].map((filter, i) => (
                        <button key={filter} className={cn("px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap", i === 0 ? "bg-primary text-primary-foreground" : "bg-card border border-border hover:bg-secondary")}>
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Posts Feed */}
                <div className="space-y-4">
                    {posts.map(post => (
                        <div key={post.id} className="bg-card border border-border rounded-2xl p-4 shadow-sm">
                            <div className="flex items-center mb-3">
                                <img src={post.avatar} alt={post.author} className="h-10 w-10 rounded-full mr-3 border border-border" />
                                <div>
                                    <h4 className="font-bold text-sm">{post.author}</h4>
                                    <div className="flex items-center text-[10px] text-muted-foreground font-bold">
                                        <span className="text-primary mr-2">{post.role}</span>
                                        <span>• {post.time}</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm font-medium leading-relaxed mb-4">
                                {post.content}
                            </p>

                            <div className="flex items-center justify-between pt-3 border-t border-border">
                                <div className="flex space-x-4">
                                    <button className="flex items-center space-x-1 text-muted-foreground hover:text-red-500 transition-colors">
                                        <Heart className="h-4 w-4" />
                                        <span className="text-xs font-bold">{post.likes}</span>
                                    </button>
                                    <button className="flex items-center space-x-1 text-muted-foreground hover:text-blue-500 transition-colors">
                                        <MessageCircle className="h-4 w-4" />
                                        <span className="text-xs font-bold">{post.comments}</span>
                                    </button>
                                </div>
                                <button className="text-muted-foreground hover:text-foreground">
                                    <Share2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAB */}
            <button className="fixed bottom-6 right-6 h-14 w-14 bg-gradient-to-r from-primary to-purple-600 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform active:scale-95 z-20">
                <Plus className="h-7 w-7" />
            </button>
        </div>
    );
}
