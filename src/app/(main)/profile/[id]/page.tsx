'use client';

import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, MapPin, ShieldCheck, Briefcase, Star, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';

export default function WorkerPublicProfile() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState<'about' | 'portfolio' | 'reviews'>('portfolio');
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchProfile = async () => {
            try {
                // Fetch User Details
                const { data: user, error: userError } = await supabase
                    .from('users')
                    .select('full_name, avatar_url, profile_image_url')
                    .eq('id', id)
                    .single();

                if (userError) throw userError;

                // Fetch Worker Details
                const { data: worker, error: workerError } = await supabase
                    .from('worker_profiles')
                    .select('*')
                    .eq('user_id', id)
                    .single();

                // Even if worker profile is missing (new worker), we show user details
                setProfile({
                    full_name: user.full_name,
                    avatar_url: user.profile_image_url || user.avatar_url,
                    bio: worker?.bio || 'No bio available yet.',
                    skills: worker?.skills || [],
                    hourly_rate: worker?.hourly_rate || 0,
                    location: worker?.location || 'Remote',
                    rating: worker?.average_rating || 5.0,
                    jobs_completed: 0 // In future, count from jobs table
                });
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Profile...</div>;
    if (!profile) return <div className="min-h-screen flex items-center justify-center">Profile not found.</div>;

    return (
        <div className="bg-background min-h-screen pb-12 transition-colors duration-300">
            {/* Header Image */}
            <div className="h-48 bg-secondary relative">
                <div className="w-full h-full bg-gradient-to-r from-primary/10 to-primary/5" />
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 p-2 rounded-full bg-background/50 hover:bg-background transition-colors backdrop-blur-md"
                >
                    <ChevronLeft className="h-6 w-6 text-foreground" />
                </button>
            </div>

            {/* Profile Info */}
            <div className="px-4 -mt-12 relative z-10 mb-6">
                <div className="flex items-end justify-between">
                    <div className="relative">
                        <div className="h-24 w-24 rounded-2xl border-4 border-background bg-zinc-100 overflow-hidden shadow-lg">
                            <img src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.full_name}`} alt="Worker" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1 rounded-full border-2 border-background">
                            <ShieldCheck className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="flex space-x-2 mb-2">
                        <Button size="sm" variant="outline" className="rounded-full h-10 w-10 p-0" onClick={() => navigate('/chat')}>
                            <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button size="sm" className="rounded-full px-6">
                            Hire Now
                        </Button>
                    </div>
                </div>

                <div className="mt-4 space-y-1">
                    <h1 className="text-2xl font-black text-foreground">{profile.full_name}</h1>
                    <p className="text-muted-foreground font-medium flex items-center">
                        <Briefcase className="h-4 w-4 mr-1" /> {profile.skills?.[0] || 'Professional'}
                    </p>
                    <div className="flex items-center space-x-4 text-sm mt-2">
                        <div className="flex items-center text-yellow-500 font-bold">
                            <Star className="h-4 w-4 fill-yellow-500 mr-1" />
                            {profile.rating}
                        </div>
                        <div className="flex items-center text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-1" />
                            {profile.location}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="sticky top-0 bg-background z-20 border-b border-border px-4 flex space-x-6 overflow-x-auto hide-scrollbar">
                {['About', 'Portfolio', 'Reviews'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab.toLowerCase() as any)}
                        className={cn(
                            "py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap",
                            activeTab === tab.toLowerCase()
                                .toLowerCase()
                                ? "border-primary text-primary"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="p-4">
                {activeTab === 'portfolio' && (
                    <div className="text-center py-10 text-muted-foreground">
                        <p className="text-sm">Portfolio items coming soon.</p>
                    </div>
                )}

                {activeTab === 'about' && (
                    <div className="space-y-4">
                        <p className="text-muted-foreground leading-relaxed">
                            {profile.bio}
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-secondary/30 p-4 rounded-xl">
                                <p className="text-xs text-muted-foreground font-bold uppercase">Rate</p>
                                <p className="text-lg font-bold">${profile.hourly_rate}/hr</p>
                            </div>

                        </div>
                    </div>
                )}
                {activeTab === 'reviews' && (
                    <div className="text-center py-10 text-muted-foreground">
                        <p>Reviews will be displayed here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
