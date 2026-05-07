'use client';

import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Receipt, Plus, Send, Download } from 'lucide-react';
import { useState } from 'react';

export default function InvoiceGenerator() {
    const navigate = useNavigate();

    const [items, setItems] = useState([{ id: 1, desc: 'Service Fee', cost: 150 }]);

    const total = items.reduce((acc, item) => acc + item.cost, 0);

    return (
        <div className="bg-background min-h-screen pb-20 text-foreground">
            <header className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-secondary">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-2">
                    <Receipt className="h-5 w-5 text-primary" />
                    <h1 className="text-lg font-black">New Invoice</h1>
                </div>
                <div className="w-10"></div>
            </header>

            <div className="p-4 space-y-6">

                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">Billed To</label>
                            <input type="text" placeholder="Client Name" className="block w-full text-lg font-bold bg-transparent border-none p-0 focus:ring-0 placeholder:text-muted-foreground/50" />
                            <input type="email" placeholder="client@email.com" className="block w-full text-sm text-muted-foreground bg-transparent border-none p-0 focus:ring-0" />
                        </div>
                        <div className="text-right">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">Order #</label>
                            <div className="font-mono font-bold">INV-0024</div>
                        </div>
                    </div>

                    <div className="space-y-4 mb-6">
                        {items.map((item) => (
                            <div key={item.id} className="flex space-x-2">
                                <input type="text" defaultValue={item.desc} className="flex-1 bg-secondary rounded-lg px-3 py-2 text-sm font-medium border-none focus:ring-1 focus:ring-primary" />
                                <div className="relative w-24">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                                    <input type="number" defaultValue={item.cost} className="w-full bg-secondary rounded-lg pl-6 pr-3 py-2 text-sm font-bold border-none focus:ring-1 focus:ring-primary text-right" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="flex items-center space-x-2 text-primary font-bold text-xs hover:underline">
                        <Plus className="h-3 w-3" />
                        <span>Add Line Item</span>
                    </button>

                    <div className="mt-8 pt-4 border-t border-border flex justify-between items-end">
                        <div className="text-xs font-bold text-muted-foreground">Total Due</div>
                        <div className="text-3xl font-black">${total}.00</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button className="bg-secondary text-foreground h-14 rounded-2xl font-bold flex items-center justify-center space-x-2">
                        <Download className="h-5 w-5" />
                        <span>Preview PDF</span>
                    </button>
                    <button className="bg-primary text-primary-foreground h-14 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-primary/25">
                        <Send className="h-5 w-5" />
                        <span>Send Now</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
