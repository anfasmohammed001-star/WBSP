'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Receipt, Plus, Send, Download, FileText, DollarSign, Trash, Mic, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { invoiceService } from '@/services/invoiceService';
import { toast } from 'react-hot-toast';

export default function InvoiceGenerator() {
    const navigate = useNavigate();
    const [items, setItems] = useState([
        { id: 1, desc: "Labor (2 hours)", amount: 160 },
        { id: 2, desc: "Pipe Fittings", amount: 45 },
    ]);
    const [isListening, setIsListening] = useState(false);

    const total = items.reduce((sum, item) => sum + item.amount, 0);

    const addItem = () => {
        setItems([...items, { id: Date.now(), desc: "New Item", amount: 0 }]);
    };

    const handleVoiceInput = async () => {
        const transcript = prompt("Simulating Voice-to-Text: Explain the work done and costs (e.g., 'Fixed the leak for $100 and bought parts for $50')");
        if (!transcript) return;

        setIsListening(true);
        try {
            const newItems = await invoiceService.parseInvoiceFromVoice(transcript);
            if (newItems && newItems.length > 0) {
                setItems([...items, ...newItems]);
                toast.success("AI added items from your description");
            } else {
                toast.error("AI couldn't find items in your description");
            }
        } catch (error) {
            toast.error("Failed to parse description");
        } finally {
            setIsListening(false);
        }
    };

    const removeItem = (id: number) => {
        setItems(items.filter(i => i.id !== id));
    };

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
                        Invoice #392
                        <Receipt className="w-5 h-5 text-blue-500" />
                    </h1>
                </div>
                <button className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-xl transition-colors bg-white/5 border border-white/5">
                    <Download className="w-5 h-5" />
                </button>
            </div>

            {/* Client Info */}
            <div className="p-6 pb-2">
                <div className="bg-[#0f172a] border border-white/5 rounded-2xl p-4 flex items-center gap-4 mb-6">
                    <img src="https://ui-avatars.com/api/?name=Alex+P&background=0D8ABC&color=fff" className="w-12 h-12 rounded-xl" />
                    <div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase">To Client</span>
                        <h3 className="font-bold text-white text-lg">Alex Pierce</h3>
                        <p className="text-xs text-slate-500">Dec 12, 2024</p>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-white text-sm">Billable Items</h3>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleVoiceInput}
                            disabled={isListening}
                            className="flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 disabled:opacity-50"
                        >
                            {isListening ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Mic className="w-4 h-4" />
                            )}
                            Voice Add
                        </button>
                        <button
                            onClick={addItem}
                            className="flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300"
                        >
                            <Plus className="w-4 h-4" />
                            Add Item
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    <div className="space-y-3 mb-6">
                        {items.map(item => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-[#0f172a] border border-white/5 rounded-2xl p-4 flex items-center gap-3 group"
                            >
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
                                    <FileText className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        defaultValue={item.desc}
                                        className="bg-transparent border-none text-white font-medium text-sm w-full outline-none placeholder:text-slate-600"
                                    />
                                </div>
                                <div className="flex items-center gap-1 bg-black/20 px-2 py-1 rounded-lg border border-white/5">
                                    <DollarSign className="w-3 h-3 text-emerald-400" />
                                    <input
                                        type="number"
                                        defaultValue={item.amount}
                                        className="bg-transparent border-none text-white font-bold text-sm w-16 text-right outline-none"
                                    />
                                </div>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="p-1 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </AnimatePresence>

                {/* Total */}
                <div className="bg-gradient-to-r from-blue-900/50 to-blue-800/50 border border-blue-500/20 rounded-3xl p-6 mb-20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="flex justify-between items-end relative z-10">
                        <div>
                            <span className="text-blue-200 text-xs font-bold uppercase mb-1 block">Total Due</span>
                            <h2 className="text-4xl font-black text-white">${total.toFixed(2)}</h2>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] text-blue-300 font-bold uppercase block mb-1">Due Date</span>
                            <span className="text-white font-bold text-sm">Upon Receipt</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Float Action */}
            <div className="fixed bottom-6 left-6 right-6 z-20">
                <Button className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.4)] border border-white/10 flex items-center justify-center gap-2">
                    <Send className="w-5 h-5" />
                    Send Invoice
                </Button>
            </div>
        </div>
    );
}
