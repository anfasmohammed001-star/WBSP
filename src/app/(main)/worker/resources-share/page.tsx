'use client';

import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Upload, FileText, Download, ThumbsUp, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function ResourceExchange() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all');

    const resources = [
        {
            id: 1,
            title: 'Electrician Field Guide (2025)',
            author: 'MikeSpark',
            type: 'PDF',
            downloads: 1240,
            likes: 450,
            image: null
        },
        {
            id: 2,
            title: 'Custom Invoice Excel Sheet',
            author: 'SarahAdmin',
            type: 'XLS',
            downloads: 890,
            likes: 320,
            image: null
        },
        {
            id: 3,
            title: 'Wiring Diagram for 3-Way Switch',
            author: 'MasterJoe',
            type: 'Image',
            downloads: 2100,
            likes: 980,
            image: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?auto=format&fit=crop&w=300&q=80'
        },
    ];

    return (
        <div className="bg-background min-h-screen pb-20 text-foreground">
            <header className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-secondary">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-2">
                    <Upload className="h-5 w-5 text-primary" />
                    <h1 className="text-lg font-black">Community Files</h1>
                </div>
                <div className="w-10"></div>
            </header>

            <div className="p-4 space-y-6">

                {/* Upload CTA */}
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl p-6 text-white text-center shadow-lg">
                    <h2 className="font-black text-xl mb-2">Share & Earn</h2>
                    <p className="text-sm opacity-90 mb-4">Upload useful templates or guides. Earn 50 credits for every 100 downloads.</p>
                    <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-gray-50 transition-colors">
                        Upload a Resource
                    </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                    {['All', 'Contracts', 'Guides', 'Blueprints', 'Tools'].map(t => (
                        <button
                            key={t}
                            onClick={() => setFilter(t.toLowerCase())}
                            className={cn("px-4 py-2 rounded-full text-xs font-bold border transition-colors",
                                filter === t.toLowerCase() ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-secondary"
                            )}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {/* Resource List */}
                <div className="grid grid-cols-1 gap-4">
                    {resources.map(res => (
                        <div key={res.id} className="bg-card border border-border rounded-2xl p-4 flex space-x-4 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                            <div className="h-20 w-20 bg-secondary rounded-xl flex items-center justify-center shrink-0 overflow-hidden relative">
                                {res.image ? (
                                    <img src={res.image} alt={res.title} className="h-full w-full object-cover" />
                                ) : (
                                    <FileText className="h-8 w-8 text-muted-foreground" />
                                )}
                                <div className="absolute top-1 right-1 bg-black/60 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                                    {res.type}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                <div>
                                    <h3 className="font-bold text-sm truncate leading-snug">{res.title}</h3>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">by {res.author}</p>
                                </div>
                                <div className="flex items-center space-x-4 text-xs font-medium text-muted-foreground">
                                    <span className="flex items-center"><Download className="h-3 w-3 mr-1" /> {res.downloads}</span>
                                    <span className="flex items-center"><ThumbsUp className="h-3 w-3 mr-1" /> {res.likes}</span>
                                </div>
                            </div>
                            <div className="flex flex-col justify-center">
                                <button className="p-2 bg-secondary rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <Download className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
