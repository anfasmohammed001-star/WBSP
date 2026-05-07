'use client';

import { useNavigate } from 'react-router-dom';
import { ChevronLeft, GraduationCap, Star, MessageCircle, UserPlus, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function Mentorship() {
    const navigate = useNavigate();
    const [mentors, setMentors] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('All Trades');

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                let query = supabase
                    .from('worker_profiles')
                    .select('user_id, bio, skills, experience_years, average_rating, user:users!user_id(full_name, avatar_url, profile_image_url)')
                    .gt('average_rating', 4.5) // Mentors should have high rating
                    .order('average_rating', { ascending: false });

                if (filter !== 'All Trades') {
                    query = query.contains('skills', [filter]);
                }

                const { data, error } = await query.limit(10);

                if (error) throw error;

                setMentors(data?.map(m => ({
                    id: m.user_id,
                    name: (m.user as any)?.full_name || 'Expert',
                    role: m.skills?.[0] || 'Specialist',
                    exp: `${m.experience_years || 5} years`,
                    rating: m.average_rating || 5.0,
                    tags: m.skills || [],
                    avatar: (m.user as any)?.profile_image_url || (m.user as any)?.avatar_url || `https://ui-avatars.com/api/?name=${(m.user as any)?.full_name}`
                })) || []);
            } catch (err) {
                console.error("Error fetching mentors:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMentors();
    }, [filter]);

    return (
        <div className="bg-background min-h-screen pb-20 text-foreground">
            <header className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-secondary">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-2">
                    < GraduationCap className="h-5 w-5 text-primary" />
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
                    {['All Trades', 'Electrician', 'Plumber', 'Carpenter', 'HVAC'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "px-4 py-2 border border-border rounded-lg text-xs font-bold whitespace-nowrap transition-colors",
                                filter === f ? "bg-primary text-primary-foreground border-primary" : "hover:bg-secondary"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Mentor List */}
                <div className="space-y-4">
                    {isLoading ? (
                        <p className="text-center text-sm text-muted-foreground">Finding mentors...</p>
                    ) : mentors.length > 0 ? mentors.map(mentor => (
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
                                        {mentor.rating.toFixed(1)}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {mentor.tags.map((tag: string) => (
                                    <span key={tag} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-[10px] font-bold uppercase">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <button className="flex items-center justify-center space-x-2 py-2 bg-secondary rounded-xl text-xs font-bold hover:bg-secondary/80" onClick={() => navigate(`/chat/${mentor.id}`)}>
                                    <MessageCircle className="h-4 w-4" />
                                    <span>Message</span>
                                </button>
                                <button className="flex items-center justify-center space-x-2 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-bold hover:bg-primary/90">
                                    <UserPlus className="h-4 w-4" />
                                    <span>Request</span>
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-10">
                            <p className="text-sm text-muted-foreground">No mentors found for this trade yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

