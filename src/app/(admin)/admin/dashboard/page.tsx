'use client';

import React from 'react';
import {
    LayoutDashboard, Users, TrendingUp, AlertCircle,
    DollarSign, Activity, Settings, Bell
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 w-64 h-full bg-slate-900 text-white p-6 hidden lg:flex flex-col z-20">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white">W</div>
                    <span className="font-black text-xl tracking-tight">WBSP Admin</span>
                </div>

                <nav className="space-y-2 flex-1">
                    {[
                        { icon: LayoutDashboard, label: "Overview", active: true },
                        { icon: Users, label: "User Management", active: false },
                        { icon: DollarSign, label: "Financials", active: false },
                        { icon: AlertCircle, label: "Disputes", active: false, badge: 3 },
                        { icon: Settings, label: "Settings", active: false },
                    ].map((item) => (
                        <button
                            key={item.label}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-bold text-sm">{item.label}</span>
                            {item.badge && (
                                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{item.badge}</span>
                            )}
                        </button>
                    ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500"></div>
                        <div>
                            <h4 className="font-bold text-sm text-white">Admin User</h4>
                            <p className="text-xs text-slate-500">Super Admin</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-64 p-8">
                {/* Header */}
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900">Platform Overview</h1>
                        <p className="text-slate-500 font-medium">Welcome back, here's what's happening today.</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-blue-600 shadow-sm relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                    </div>
                </header>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        { label: "Total Revenue", value: "$124,500", trend: "+12.5%", color: "text-emerald-500", icon: DollarSign },
                        { label: "Active Workers", value: "1,240", trend: "+5.2%", color: "text-blue-500", icon: Users },
                        { label: "Active Jobs", value: "385", trend: "+8.1%", color: "text-purple-500", icon: Activity },
                        { label: "Pending Disputes", value: "12", trend: "-2.4%", color: "text-red-500", icon: AlertCircle },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color} bg-current bg-opacity-10`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <span className={`text-xs font-bold ${stat.trend.startsWith('+') ? 'text-emerald-500 bg-emerald-50' : 'text-red-500 bg-red-50'} px-2 py-1 rounded-lg`}>
                                    {stat.trend}
                                </span>
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 mb-1">{stat.value}</h3>
                            <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Growth */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg">Growth Trends</h3>
                            <select className="bg-slate-50 border-none text-sm font-bold text-slate-600 rounded-lg outline-none">
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                            </select>
                        </div>
                        <div className="h-64 flex items-end gap-4">
                            {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                                <div key={i} className="flex-1 bg-slate-50 rounded-t-xl relative group overflow-hidden">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h}%` }}
                                        className="absolute bottom-0 w-full bg-blue-600 rounded-t-xl group-hover:bg-blue-500 transition-colors"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 text-xs font-bold text-slate-400 uppercase">
                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                        </div>
                    </div>

                    {/* Critical Alerts */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-lg mb-6">System Health</h3>
                        <div className="space-y-4">
                            {[
                                { title: "API Latency High", time: "2m ago", status: "Critical", color: "red" },
                                { title: "New Worker Verification", time: "15m ago", status: "Pending", color: "amber" },
                                { title: "Payment Gateway", time: "1h ago", status: "Operational", color: "emerald" },
                            ].map((alert, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
                                    <div className={`w-2 h-2 rounded-full bg-${alert.color}-500 animate-pulse`} />
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm text-slate-900">{alert.title}</h4>
                                        <p className="text-xs text-slate-500">{alert.time}</p>
                                    </div>
                                    <span className={`text-[10px] font-bold text-${alert.color}-500 bg-${alert.color}-50 px-2 py-1 rounded-lg uppercase`}>
                                        {alert.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
