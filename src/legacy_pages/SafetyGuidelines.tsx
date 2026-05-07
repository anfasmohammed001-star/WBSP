import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ShieldAlert, Phone, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function SafetyGuidelines() {
    const navigate = useNavigate();
    const [openItem, setOpenItem] = useState<number | null>(0);

    const guidelines = [
        {
            id: 0,
            title: 'Personal Protective Equipment (PPE)',
            content: 'Always wear appropriate gear for your trade. This includes safety goggles, gloves, steal-toe boots, and helmets where necessary. Never compromise on your personal safety gear.',
        },
        {
            id: 1,
            title: 'Customer Interaction Safety',
            content: 'Maintain professional boundaries. If you feel unsafe in a customer\'s home, you have the right to leave immediately. Report any incidents to support ASAP.',
        },
        {
            id: 2,
            title: 'Electrical Safety Basics',
            content: 'Always assume wires are live. Use insulated tools. Never work on wet surfaces with electrical equipment. LOTO (Lock Out / Tag Out) procedures must be followed.',
        },
        {
            id: 3,
            title: 'Hazardous Materials',
            content: 'Know the chemicals you work with. Read MSDS sheets. Ensure proper ventilation when using strong solvents or paints.',
        }
    ];

    return (
        <div className="bg-background min-h-screen pb-20 text-foreground">
            {/* Header */}
            <header className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-secondary">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-2 text-red-500">
                    <ShieldAlert className="h-5 w-5" />
                    <h1 className="text-lg font-black text-foreground">Safety First</h1>
                </div>
                <div className="w-10"></div>
            </header>

            <div className="p-4 space-y-6">
                {/* Emergency Section */}
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-center">
                    <h2 className="text-red-600 font-black text-lg mb-1 flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 mr-2" />
                        In Case of Emergency
                    </h2>
                    <p className="text-xs text-muted-foreground mb-4">
                        If you or someone else is in immediate danger, call local emergency services immediately.
                    </p>
                    <button className="w-full bg-red-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-500/30 flex items-center justify-center space-x-2 hover:bg-red-700 transition-colors">
                        <Phone className="h-5 w-5" />
                        <span>Call 911 / Emergency</span>
                    </button>
                    <div className="mt-3">
                        <button className="text-xs font-bold text-red-500 underline">Call Support Hotline</button>
                    </div>
                </div>

                {/* Guidelines Accordion */}
                <div>
                    <h3 className="font-bold text-lg mb-4 px-2">Essential Guidelines</h3>
                    <div className="space-y-3">
                        {guidelines.map((item) => (
                            <div key={item.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                                <button
                                    onClick={() => setOpenItem(openItem === item.id ? null : item.id)}
                                    className="w-full flex items-center justify-between p-4 text-left font-bold"
                                >
                                    <span>{item.title}</span>
                                    {openItem === item.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                                </button>
                                <AnimatePresence>
                                    {openItem === item.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-4 pt-0 text-sm text-muted-foreground leading-relaxed border-t border-border/50">
                                                {item.content}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
