import { useNavigate } from 'react-router-dom';
import { ChevronLeft, GraduationCap, Star, MessageCircle, UserPlus, Filter } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState } from 'react';

export default function Mentorship() {
    const navigate = useNavigate();

    const mentors = [
        {
            id: 1,
            name: 'Robert Fox',
            role: 'Master Electrician',
            exp: '15 years',
            rating: 5.0,
            tags: ['Commercial', 'Wiring'],
            avatar: 'https://i.pravatar.cc/150?u=robert'
        },
        {
            id: 2,
            name: 'Kristin Watson',
            role: 'HVAC Specialist',
            exp: '10 years',
            rating: 4.9,
            tags: ['Installation', 'Repair'],
            avatar: 'https://i.pravatar.cc/150?u=kristin'
        },
    ];

    return (
        <div className="bg-background min-h-screen pb-20 text-foreground">
            <header className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-secondary">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <h1 className="text-lg font-black">Find a Mentor</h1>
                </div>
                <div className="w-10"></div>
            </header>

            <div className="p-4 space-y-6">

                {/* Promo Card */}
                <div className="bg-card border border-border p-6 rounded-3xl text-center shadow-sm">
                    <h2 className="font-black text-xl mb-2">Grow Faster with a Pro</h2>
                    <p className="text-sm text-muted-foreground mb-4">Get 1-on-1 advice, code reviews, and career guidance from industry veterans.</p>
                    <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/25">
                        Become a Mentor
                    </button>
                </div>

                {/* Filters */}
                <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                    <button className="bg-secondary p-2 rounded-lg shrink-0">
                        <Filter className="h-4 w-4" />
                    </button>
                    {['All Trades', 'Electrician', 'Plumber', 'Carpenter', 'HVAC'].map(filter => (
                        <button key={filter} className="px-4 py-2 border border-border rounded-lg text-xs font-bold whitespace-nowrap hover:bg-secondary transition-colors">
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Mentor List */}
                <div className="space-y-4">
                    {mentors.map(mentor => (
                        <div key={mentor.id} className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-3">
                                    <img src={mentor.avatar} alt={mentor.name} className="h-14 w-14 rounded-2xl object-cover" />
                                    <div>
                                        <h3 className="font-bold text-base">{mentor.name}</h3>
                                        <div className="text-xs text-primary font-bold">{mentor.role}</div>
                                        <div className="text-[10px] text-muted-foreground mt-0.5">{mentor.exp} exp</div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center bg-yellow-500/10 px-2 py-0.5 rounded-md text-yellow-600 font-bold text-xs">
                                        <Star className="h-3 w-3 mr-1 fill-yellow-600" />
                                        {mentor.rating}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {mentor.tags.map(tag => (
                                    <span key={tag} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-[10px] font-bold uppercase">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <button className="flex items-center justify-center space-x-2 py-2 bg-secondary rounded-xl text-xs font-bold hover:bg-secondary/80">
                                    <MessageCircle className="h-4 w-4" />
                                    <span>Message</span>
                                </button>
                                <button className="flex items-center justify-center space-x-2 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-bold hover:bg-primary/90">
                                    <UserPlus className="h-4 w-4" />
                                    <span>Request</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
