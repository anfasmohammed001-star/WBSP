'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Download, Search, ArrowUpRight, ArrowDownLeft, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function TransactionHistory() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

    const transactions = [
        { id: 'TX-8921', title: 'Payout from WBSP', date: 'Today, 10:23 AM', amount: '+$450.00', type: 'income', method: 'Direct Deposit', status: 'Completed' },
        { id: 'TX-8920', title: 'Start Kit Purchase', date: 'Yesterday, 2:15 PM', amount: '-$120.50', type: 'expense', method: 'Visa ••4242', status: 'Completed' },
        { id: 'TX-8919', title: 'Service Fee', date: 'Oct 24, 2024', amount: '-$5.00', type: 'expense', method: 'Wallet', status: 'Pending' },
        { id: 'TX-8918', title: 'Tip from Sarah', date: 'Oct 24, 2024', amount: '+$25.00', type: 'income', method: 'Worker Wallet', status: 'Completed' },
        { id: 'TX-8917', title: 'Payout from WBSP', date: 'Oct 20, 2024', amount: '+$890.00', type: 'income', method: 'Direct Deposit', status: 'Completed' },
    ];

    const filteredTx = filter === 'all' ? transactions : transactions.filter(t => t.type === filter);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
            {/* Header */}
            <div className="bg-white border-b border-slate-100 sticky top-0 z-10 px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 -ml-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-900"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl font-bold">Transactions</h1>
                    </div>
                    <button className="p-2 bg-slate-100 rounded-xl text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                        <Download className="w-5 h-5" />
                    </button>
                </div>

                {/* Search & Tabs */}
                <div className="flex gap-3 mb-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full h-9 pl-9 pr-4 bg-slate-100 rounded-lg text-sm font-medium border-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all placeholder:text-slate-400"
                        />
                    </div>
                    <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:border-slate-300 transition-all">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex gap-2">
                    {['all', 'income', 'expense'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={cn(
                                "flex-1 py-1.5 rounded-lg text-xs font-bold capitalize transition-all border",
                                filter === f
                                    ? "bg-slate-900 border-slate-900 text-white"
                                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="p-4 space-y-3">
                {filteredTx.map(tx => (
                    <div key={tx.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-blue-200 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                                tx.type === 'income' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                            )}>
                                {tx.type === 'income' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-sm mb-0.5">{tx.title}</h3>
                                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                    <span>{tx.date}</span>
                                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                    <span>{tx.method}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className={cn(
                                "block font-bold text-sm mb-0.5",
                                tx.type === 'income' ? "text-emerald-600" : "text-slate-900"
                            )}>
                                {tx.amount}
                            </span>
                            <span className={cn(
                                "text-[10px] font-bold uppercase px-1.5 py-0.5 rounded",
                                tx.status === 'Completed' ? "bg-slate-100 text-slate-500" : "bg-amber-50 text-amber-600"
                            )}>
                                {tx.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
