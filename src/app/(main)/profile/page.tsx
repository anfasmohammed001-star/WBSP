'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Star, Edit2, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

export default function Profile() {
    const navigate = useNavigate();
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        bio: '',
        location: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.fullName || '',
                bio: (user as any).bio || '',
                location: (user as any).location || ''
            });
        }
    }, [user]);

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('users')
                .update({
                    full_name: formData.full_name,
                    bio: formData.bio,
                    location: formData.location
                })
                .eq('id', user.id);

            if (error) throw error;

            updateUser({
                fullName: formData.full_name,
                bio: formData.bio,
                location: formData.location
            } as any);

            setIsEditing(false);
        } catch (err) {
            console.error("Error updating profile:", err);
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) return <div className="min-h-screen flex items-center justify-center">Please log in.</div>;

    return (
        <div className="p-4 space-y-6 max-w-md mx-auto bg-background text-foreground min-h-screen shadow-2xl overflow-hidden border-x border-border">
            {/* Header */}
            <div className="flex flex-col items-center pb-6 border-b border-border relative">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute left-0 top-0 p-2 rounded-full hover:bg-secondary transition-colors"
                >
                    <ChevronLeft className="h-6 w-6 text-foreground" />
                </button>
                <div className="relative mb-4">
                    <div className="h-24 w-24 bg-secondary rounded-full overflow-hidden border border-border">
                        <img src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.fullName}`} className="w-full h-full object-cover" />
                    </div>
                    <button className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full shadow-lg">
                        <Camera className="h-4 w-4" />
                    </button>
                </div>
                <h1 className="text-xl font-bold text-foreground">{user.fullName}</h1>
                <div className="flex items-center text-muted-foreground text-sm mt-1">
                    <MapPin className="h-3 w-3 mr-1" /> {formData.location || 'Not set'}
                </div>
            </div>

            {/* Info Sections */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="font-bold text-lg text-foreground">Personal Info</h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        disabled={isSaving}
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        className="text-primary hover:text-primary/80"
                    >
                        <Edit2 className="h-4 w-4 mr-2" /> {isSaving ? 'Saving...' : (isEditing ? 'Save' : 'Edit')}
                    </Button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                        {isEditing ? (
                            <Input value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} className="bg-background border-input text-foreground" />
                        ) : (
                            <p className="text-foreground">{user.fullName}</p>
                        )}
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                        <p className="text-foreground">{user.email}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Location</label>
                        {isEditing ? (
                            <Input value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="bg-background border-input text-foreground" />
                        ) : (
                            <p className="text-foreground">{formData.location || 'Not set'}</p>
                        )}
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Bio</label>
                        {isEditing ? (
                            <textarea
                                className="w-full p-2 border border-input rounded-md bg-background text-foreground focus:ring-ring focus:border-ring"
                                value={formData.bio}
                                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                            />
                        ) : (
                            <p className="text-foreground">{formData.bio || 'Professional'}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats/Reviews (ReadOnly) */}
            <div className="pt-4 border-t border-border">
                <h2 className="font-bold text-lg mb-4 text-foreground">Account Type</h2>
                <div className="bg-card p-4 rounded-xl border border-border shadow-sm text-center capitalize py-4">
                    <p className="font-bold text-primary">{user.userType}</p>
                </div>
            </div>
        </div>
    );
}

