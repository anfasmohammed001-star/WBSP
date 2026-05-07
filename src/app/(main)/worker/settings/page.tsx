'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    User,
    Mail,
    Phone,
    Calendar,
    UserCircle,
    Camera,
    LogOut,
    Trash2,
    Shield,
    Bell,
    Eye,
    Lock,
    Save
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { syncService } from '@/services/syncService';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function WorkerSettings() {
    const navigate = useNavigate();
    const { user, logout, updateUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        mobile: user?.mobile || '',
        gender: user?.gender || '',
        dob: user?.dateOfBirth || '',
        avatarUrl: user?.avatarUrl || ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                email: user.email || '',
                mobile: user.mobile || '',
                gender: user.gender || '',
                dob: user.dateOfBirth || '',
                avatarUrl: user.avatarUrl || ''
            });
        }
    }, [user]);

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        try {
            setIsLoading(true);
            const fileExt = file.name.split('.').pop();
            const filePath = `${user.id}/avatar_${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, avatarUrl: publicUrl }));
            toast.success("Avatar uploaded successfully!");
        } catch (error) {
            console.error("Avatar upload error:", error);
            toast.error("Failed to upload avatar");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!user) return;

        try {
            setIsLoading(true);

            const updateData = {
                id: user.id,
                full_name: formData.fullName,
                mobile: formData.mobile,
                gender: formData.gender,
                dob: formData.dob,
                profile_image_url: formData.avatarUrl,
                updated_at: new Date().toISOString()
            };

            await syncService.enqueueMutation('profiles', 'UPDATE', updateData);

            // Update local auth state
            updateUser({
                fullName: formData.fullName,
                mobile: formData.mobile,
                gender: formData.gender,
                dateOfBirth: formData.dob,
                avatarUrl: formData.avatarUrl
            });

            toast.success("Settings saved successfully!");
        } catch (error) {
            console.error("Settings save error:", error);
            toast.error("Failed to save settings");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = () => {
        const confirmed = window.confirm("Are you absolutely sure you want to delete your account? This action cannot be undone.");
        if (confirmed) {
            toast.error("Account deletion is a sensitive operation. Please contact support.");
        }
    };

    return (
        <div className="bg-background min-h-screen pb-24 text-foreground dark">
            {/* Header */}
            <header className="p-6 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-xl z-50 border-b border-border/50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary/80 border border-border/50 hover:bg-secondary transition-all"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-black tracking-tight">Worker Settings</h1>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Profile & Account</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="h-10 px-4 bg-primary text-primary-foreground rounded-xl flex items-center gap-2 font-bold text-xs hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
                >
                    <Save className="h-4 w-4" />
                    Save
                </button>
            </header>

            <main className="p-6 space-y-8 max-w-2xl mx-auto">
                {/* 1. Avatar Section */}
                <section className="flex flex-col items-center gap-4 py-4">
                    <div className="relative group">
                        <div className="h-32 w-32 rounded-[2.5rem] overflow-hidden border-4 border-primary/20 bg-secondary/30 relative">
                            {formData.avatarUrl ? (
                                <img src={formData.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                                    <UserCircle className="h-20 w-20 opacity-20" />
                                </div>
                            )}
                            <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <Camera className="h-8 w-8 text-white mb-1" />
                                <span className="text-[10px] text-white font-black uppercase">Change</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                            </label>
                        </div>
                        <div className="absolute -bottom-1 -right-1 h-8 w-8 bg-green-500 rounded-full border-4 border-background flex items-center justify-center">
                            <Shield className="h-4 w-4 text-white" />
                        </div>
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-black">{formData.fullName || "Your Name"}</h2>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{user?.userType} Profile</p>
                    </div>
                </section>

                {/* 2. Profile Details Form */}
                <section className="space-y-6">
                    <div className="flex items-center gap-2 px-1">
                        <User className="h-4 w-4 text-primary" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Personal Information</h3>
                    </div>

                    <div className="grid gap-4">
                        {/* Full Name */}
                        <div className="space-y-1.5 px-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Alexander Sterling"
                                    value={formData.fullName}
                                    onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                                    className="w-full bg-secondary/20 border border-border/50 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5 px-1 opacity-60">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full bg-secondary/10 border border-border/50 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Gender */}
                            <div className="space-y-1.5 px-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Gender</label>
                                <div className="relative">
                                    <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <select
                                        value={formData.gender}
                                        onChange={e => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                                        className="w-full bg-secondary/20 border border-border/50 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold appearance-none focus:border-primary/50 outline-none"
                                    >
                                        <option value="">Select</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            {/* Date of Birth */}
                            <div className="space-y-1.5 px-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Date of Birth</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground flex pointer-events-none" />
                                    <input
                                        type="date"
                                        value={formData.dob}
                                        onChange={e => setFormData(prev => ({ ...prev, dob: e.target.value }))}
                                        className="w-full bg-secondary/20 border border-border/50 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:border-primary/50 outline-none [color-scheme:dark]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Mobile Number */}
                        <div className="space-y-1.5 px-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Mobile Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="tel"
                                    placeholder="+1 234 567 890"
                                    value={formData.mobile}
                                    onChange={e => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                                    className="w-full bg-secondary/20 border border-border/50 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:border-primary/50 outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <hr className="border-border/50" />

                {/* 3. Account Actions */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <Lock className="h-4 w-4 text-primary" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Account Controls</h3>
                    </div>

                    <div className="grid gap-3">
                        <button
                            onClick={logout}
                            className="w-full bg-secondary/20 border border-border/50 rounded-2xl p-5 flex items-center justify-between group hover:bg-secondary/40 transition-all active:scale-[0.98]"
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/10">
                                    <LogOut className="h-5 w-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-black">Sign Out</p>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none mt-1">Exit current session</p>
                                </div>
                            </div>
                            < ChevronLeft className="h-4 w-4 text-muted-foreground rotate-180" />
                        </button>

                        <button
                            onClick={handleDeleteAccount}
                            className="w-full bg-red-500/5 border border-red-500/10 rounded-2xl p-5 flex items-center justify-between group hover:bg-red-500/10 transition-all active:scale-[0.98]"
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/10">
                                    <Trash2 className="h-5 w-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-black text-red-500">Delete Account</p>
                                    <p className="text-[10px] font-bold text-red-500/50 uppercase leading-none mt-1">Permanently remove profile</p>
                                </div>
                            </div>
                            < ChevronLeft className="h-4 w-4 text-red-500/30 rotate-180" />
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}
