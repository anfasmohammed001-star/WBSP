'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ChevronLeft,
    MoreHorizontal,
    MapPin,
    Star,
    ShieldCheck,
    MessageCircle,
    Calendar,
    Clock,
    Award,
    CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';

export default function WorkerPublicProfile() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchProfile = async () => {
            try {
                // Fetch User Details
                const { data: user, error: userError } = await supabase
                    .from('users')
                    .select('full_name, avatar_url, profile_image_url, location')
                    .eq('id', id)
                    .single();

                if (userError) throw userError;

                // Fetch Worker Details
                const { data: worker, error: workerError } = await supabase
                    .from('worker_profiles')
                    .select('*')
                    .eq('user_id', id)
                    .single();

                // Fetch Reviews
                const { data: reviews } = await supabase
                    .from('reviews')
                    .select('id, rating, comment, created_at, reviewer:users!reviewer_id(full_name)')
                    .eq('reviewee_id', id)
                    .order('created_at', { ascending: false })
                    .limit(5);

                setProfile({
                    name: user.full_name,
                    avatar_url: user.profile_image_url || user.avatar_url,
                    location: user.location || worker?.location || 'Remote',
                    profession: worker?.skills?.[0] || 'Professional',
                    rating: worker?.average_rating || 5.0,
                    reviewsCount: 0, // In future, count from reviews table
                    rate: worker?.hourly_rate ? `$${worker.hourly_rate}/hr` : 'Negotiable',
                    about: worker?.bio || 'No bio available.',
                    badges: ["Verified Pro", "Pioneer"],
                    stats: {
                        jobs: 0,
                        repeat: "100%",
                        ontime: "100%"
                    },
                    reviews_list: reviews?.map(r => ({
                        id: r.id,
                        user: (r.reviewer as any)?.full_name || 'Anonymous',
                        rating: r.rating,
                        text: r.comment,
                        date: new Date(r.created_at).toLocaleDateString()
                    })) || []
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
        <div className="min-h-screen bg-slate-50 pb-24">
            {/* Header / Hero */}
            <div className="relative h-64 bg-slate-900">
                <img
                    src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=1200"
                    className="w-full h-full object-cover opacity-60"
                    alt="Cover"
                />
                <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-10">
                    <button onClick={() => navigate(-1)} className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors">
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors">
                        <MoreHorizontal className="h-6 w-6" />
                    </button>
                </div>
            </div>

            {/* Profile Content */}
            <div className="px-6 -mt-20 relative z-10">
                {/* ID Card */}
                <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="relative -mt-16 bg-white p-1.5 rounded-2xl shadow-sm">
                            <img
                                src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.name}`}
                                className="w-24 h-24 rounded-xl object-cover"
                                alt="Profile"
                            />
                            <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1.5 rounded-full border-4 border-white">
                                <ShieldCheck className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <h2 className="text-2xl font-black text-slate-900">{profile.rate}</h2>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Starting Rate</span>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h1 className="text-2xl font-black text-slate-900 mb-1 flex items-center gap-2">
                            {profile.name}
                            <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide border border-blue-100">Pro</span>
                        </h1>
                        <p className="text-slate-500 font-medium mb-2">{profile.profession}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {profile.badges.map((badge: string) => (
                                <span key={badge} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-600 flex items-center gap-1.5">
                                    <Award className="w-3.5 h-3.5 text-amber-500" />
                                    {badge}
                                </span>
                            ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                            <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-slate-400" />
                                {profile.location}
                            </div>
                            <div className="flex items-center gap-1 text-amber-500">
                                <Star className="w-4 h-4 fill-amber-500" />
                                <span className="text-slate-900 font-bold">{profile.rating}</span>
                                <span className="text-slate-400">({profile.reviews_list.length} reviews)</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 h-12 font-bold" onClick={() => navigate(`/post-job?worker_id=${id}`)}>
                            Hire Now
                        </Button>
                        <Button variant="outline" className="flex-1 border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl h-12 font-bold gap-2" onClick={() => navigate(`/chat/${id}`)}>
                            <MessageCircle className="w-4 h-4" />
                            Message
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
                        <span className="text-2xl font-black text-slate-900 mb-1">{profile.stats.jobs}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase text-center">Jobs Done</span>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
                        <span className="text-2xl font-black text-slate-900 mb-1">{profile.stats.repeat}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase text-center">Repeat Hire</span>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
                        <span className="text-2xl font-black text-slate-900 mb-1">{profile.stats.ontime}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase text-center">On Time</span>
                    </div>
                </div>

                {/* About Section */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-3">About Master</h3>
                    <p className="text-slate-600 leading-relaxed text-sm">
                        {profile.about}
                    </p>
                </div>

                {/* Reviews Preview */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-slate-900">Recent Reviews</h3>
                        <button className="text-sm font-bold text-blue-600">View All</button>
                    </div>
                    <div className="space-y-3">
                        {profile.reviews_list.length > 0 ? profile.reviews_list.map((review: any) => (
                            <div key={review.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-500">
                                            {review.user[0]}
                                        </div>
                                        <span className="font-bold text-slate-900 text-sm">{review.user}</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400">{review.date}</span>
                                </div>
                                <div className="flex text-amber-400 mb-2">
                                    {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400" />)}
                                </div>
                                <p className="text-slate-600 text-sm italic">"{review.text}"</p>
                            </div>
                        )) : (
                            <p className="text-sm text-center text-muted-foreground py-4">No reviews yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

