'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Users, Shield, MoreVertical, Mail, Trash, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

export default function UserManagement() {
    const navigate = useNavigate();

    const users = [
        {
            id: 1,
            name: "Mario Sterling",
            email: "mario@wbsp.com",
            role: "Owner",
            avatar: "https://ui-avatars.com/api/?name=Mario+S&background=0D8ABC&color=fff",
            status: "Active"
        },
        {
            id: 2,
            name: "Sarah Jenkins",
            email: "sarah@wbsp.com",
            role: "Admin",
            avatar: "https://ui-avatars.com/api/?name=Sarah+J&background=10B981&color=fff",
            status: "Active"
        },
        {
            id: 3,
            name: "Tom Holland",
            email: "tom@wbsp.com",
            role: "Member",
            avatar: "https://ui-avatars.com/api/?name=Tom+H&background=EF4444&color=fff",
            status: "Pending"
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
                        Team
                        <Users className="w-5 h-5 text-purple-500" />
                    </h1>
                </div>
                <button className="bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-xl transition-colors shadow-lg shadow-purple-500/20">
                    <UserPlus className="w-5 h-5" />
                </button>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="mb-6 flex items-center gap-4">
                    <div className="bg-[#0f172a] border border-white/5 rounded-2xl p-4 flex-1 flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg">Pro Plan</h3>
                            <p className="text-xs text-slate-500">5/10 Seats Used</p>
                        </div>
                    </div>
                </div>

                <div className="bg-[#0f172a] border border-white/5 rounded-3xl overflow-hidden">
                    {users.map((user, index) => (
                        <div
                            key={user.id}
                            className={`p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group ${index !== users.length - 1 ? 'border-b border-white/5' : ''}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <img src={user.avatar} className="w-10 h-10 rounded-xl" />
                                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#0f172a] ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">{user.name}</h3>
                                    <p className="text-xs text-slate-500">{user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-lg border ${user.role === 'Owner'
                                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                    : 'bg-slate-800 text-slate-400 border-white/5'
                                    }`}>
                                    {user.role}
                                </span>
                                <button className="p-1 text-slate-600 hover:text-white transition-colors">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 text-center">
                    <p className="text-xs text-slate-600 font-medium">Need more seats? <button className="text-purple-400 hover:text-purple-300 font-bold">Upgrade Plan</button></p>
                </div>
            </div>
        </div>
    );
}
