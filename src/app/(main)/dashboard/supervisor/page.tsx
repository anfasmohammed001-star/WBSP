'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Shield, UserCheck, Search, Activity, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function SupervisorDashboard() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchUsers = async () => {
        setIsLoading(true);
        console.log("SupervisorDashboard: Initiating user sync...");

        const fetchData = async (retries = 3, delay = 1000) => {
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setUsers(data || []);
            } catch (error: any) {
                if (retries > 0) {
                    console.warn(`SupervisorDashboard: Fetch failed, retrying in ${delay}ms...`, error.message);
                    await new Promise(r => setTimeout(r, delay));
                    return fetchData(retries - 1, delay * 2);
                }
                throw error;
            }
        };

        try {
            await fetchData();
        } catch (error: any) {
            console.error("SupervisorDashboard: Critical fetch failure", error);
            toast.error("Database connection delayed. Please refresh.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen pb-32 relative overflow-hidden bg-[#020408]">
            {/* Ambient Background Effects */}
            <div className="bg-blur-blobs">
                <div className="blob bg-primary/20 -top-[10%] -right-[10%] scale-150" />
                <div className="blob bg-purple-600/10 bottom-[10%] -left-[10%] scale-150" style={{ animationDelay: '-8s' }} />
                <div className="absolute inset-0 bg-grid opacity-[0.03]" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto p-6 pt-12">
                {/* Header section with Stats */}
                <div className="mb-12 space-y-8">
                    <div className="flex justify-between items-end">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">System Override Active</span>
                            </div>
                            <h1 className="text-4xl font-black tracking-tighter text-white flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-glass-obsidian border border-white/10">
                                    <Shield className="h-8 w-8 text-primary" />
                                </div>
                                Command Center
                            </h1>
                            <p className="text-white/40 mt-3 font-medium uppercase text-[10px] tracking-widest">Supervisor & Administrative Insight Network</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05, rotate: 180 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={fetchUsers}
                            className="p-4 rounded-2xl bg-glass-obsidian border border-white/10 text-white/70 hover:text-primary transition-all"
                        >
                            <RefreshCw className={cn("h-6 w-6", isLoading && "animate-spin")} />
                        </motion.button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: 'TOTAL ENTITIES', value: users.length, icon: <Users className="h-5 w-5" />, color: 'text-blue-500' },
                            { label: 'ACTIVE OPERATIVES', value: users.filter(u => u.user_type === 'worker').length, icon: <Activity className="h-5 w-5" />, color: 'text-emerald-500' },
                            { label: 'VERIFIED VECTORS', value: users.filter(u => u.full_name).length, icon: <UserCheck className="h-5 w-5" />, color: 'text-purple-500' },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-glass-obsidian border border-white/5 p-8 rounded-[2.5rem] shadow-2xl group"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-[10px] font-black text-white/30 tracking-widest uppercase">{stat.label}</span>
                                    <div className={cn("p-2.5 rounded-xl bg-white/5", stat.color)}>{stat.icon}</div>
                                </div>
                                <div className="text-4xl font-black text-white tracking-tighter group-hover:text-primary transition-colors">{stat.value}</div>
                                <div className="mt-2 h-1 w-12 bg-primary/20 rounded-full group-hover:w-full transition-all duration-500" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* User List Table */}
                <div className="space-y-6">
                    <div className="relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Identify specific vector or operative..."
                            className="w-full pl-14 pr-8 py-5 rounded-2xl bg-glass-obsidian border-white/5 border focus:border-primary/50 text-white placeholder:text-white/20 outline-none transition-all font-bold tracking-tight"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-glass-obsidian border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl backdrop-blur-3xl"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/[0.02]">
                                        <th className="px-8 py-6 text-[10px] font-black tracking-[0.2em] text-white/30 uppercase">Operative Identifier</th>
                                        <th className="px-8 py-6 text-[10px] font-black tracking-[0.2em] text-white/30 uppercase">Classification</th>
                                        <th className="px-8 py-6 text-[10px] font-black tracking-[0.2em] text-white/30 uppercase">Deployment Data</th>
                                        <th className="px-8 py-6 text-[10px] font-black tracking-[0.2em] text-white/30 uppercase">State</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                                    <span className="text-xs font-black text-white/20 uppercase tracking-widest">Scanning Databases...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-20 text-center text-white/20 font-black uppercase tracking-widest text-sm">
                                                Zero Signal detected for Query.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-white/[0.03] transition-colors group cursor-pointer">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-slate-900 to-black flex items-center justify-center font-black text-primary border border-white/10 group-hover:scale-110 transition-transform shadow-xl">
                                                            {user.full_name?.[0]?.toUpperCase() || 'U'}
                                                        </div>
                                                        <div>
                                                            <div className="font-black text-white tracking-tight text-lg group-hover:text-primary transition-colors">{user.full_name || 'Unidentified'}</div>
                                                            <div className="text-xs text-white/30 font-bold">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={cn(
                                                        "px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border",
                                                        user.user_type === 'worker' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                                            user.user_type === 'supervisor' ? "bg-purple-500/10 text-purple-500 border-purple-500/20" :
                                                                "bg-primary/10 text-primary border-primary/20"
                                                    )}>
                                                        {user.user_type}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-xs text-white/40 font-black tabular-nums">
                                                    {new Date(user.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                                        <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Link Active</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
