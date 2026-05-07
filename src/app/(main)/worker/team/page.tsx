'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft, Users, Calendar, CheckSquare,
    MessageSquare, Plus, Clock, LayoutDashboard
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

export default function TeamProjects() {
    const navigate = useNavigate();

    const projects = [
        {
            id: 1,
            title: "Downtown Loft Renovation",
            members: [
                "https://ui-avatars.com/api/?name=Alex+M&background=0D8ABC&color=fff",
                "https://ui-avatars.com/api/?name=Sarah+J&background=10B981&color=fff",
                "https://ui-avatars.com/api/?name=Mike+R&background=F59E0B&color=fff",
            ],
            deadline: "Oct 30",
            progress: 65,
            tasks: { done: 12, total: 18 },
            status: "In Progress"
        },
        {
            id: 2,
            title: "Commercial HVAC Install",
            members: [
                "https://ui-avatars.com/api/?name=Tom+H&background=EF4444&color=fff",
                "https://ui-avatars.com/api/?name=Alex+M&background=0D8ABC&color=fff",
            ],
            deadline: "Nov 15",
            progress: 10,
            tasks: { done: 2, total: 20 },
            status: "Planning"
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
                        Team Projects
                        <LayoutDashboard className="w-5 h-5 text-indigo-500" />
                    </h1>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-xl transition-colors shadow-lg shadow-indigo-500/20">
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            {/* Active Projects */}
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Active Boards</h2>
                    <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300">View All</button>
                </div>

                {projects.map(project => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#0f172a] border border-white/5 rounded-3xl p-5 hover:border-indigo-500/30 transition-all cursor-pointer group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-white mb-1 group-hover:text-indigo-400 transition-colors">{project.title}</h3>
                                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3.5 h-3.5" />
                                        Due {project.deadline}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-md uppercase font-bold text-[10px] ${project.status === 'In Progress' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-amber-500/10 text-amber-400'
                                        }`}>
                                        {project.status}
                                    </span>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 text-slate-400">
                                <MoreHorizontal className="w-5 h-5" />
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="mb-4">
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <span className="text-slate-400">Progress</span>
                                <span className="text-white">{project.progress}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${project.progress}%` }} />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                            <div className="flex -space-x-2">
                                {project.members.map((m, i) => (
                                    <img key={i} src={m} className="w-8 h-8 rounded-full border-2 border-[#0f172a]" />
                                ))}
                                <div className="w-8 h-8 rounded-full border-2 border-[#0f172a] bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                    +2
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <div className="flex items-center gap-1.5 text-slate-400 bg-white/5 px-3 py-1.5 rounded-lg">
                                    <CheckSquare className="w-3.5 h-3.5" />
                                    <span className="text-xs font-bold">{project.tasks.done}/{project.tasks.total}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20">
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    <span className="text-xs font-bold">Chat</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Quick Create */}
            <div className="px-6">
                <button className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-2 text-slate-500 font-bold hover:border-white/20 hover:text-slate-300 transition-all">
                    <Plus className="w-5 h-5" />
                    Create New Project Board
                </button>
            </div>
        </div>
    );
}

function MoreHorizontal({ className }: { className?: string }) {
    return (
        <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
        </svg>
    )
}
