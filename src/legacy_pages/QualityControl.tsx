import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ClipboardCheck, Camera, CheckSquare, ShieldCheck, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState } from 'react';

export default function QualityControl() {
    const navigate = useNavigate();

    const [checklist, setChecklist] = useState([
        { id: 1, text: 'Site cleared of debris', checked: false },
        { id: 2, text: 'Safety gear worn at all times', checked: true },
        { id: 3, text: 'Tools cleaned and packed', checked: false },
        { id: 4, text: 'Final client walkthrough completed', checked: false },
    ]);

    const toggleItem = (id: number) => {
        setChecklist(prev => prev.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
    };

    const progress = Math.round((checklist.filter(i => i.checked).length / checklist.length) * 100);

    return (
        <div className="bg-background min-h-screen pb-20 text-foreground">
            <header className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-secondary">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-2">
                    <ShieldCheck className="h-5 w-5 text-green-500" />
                    <h1 className="text-lg font-black">Quality Assurance</h1>
                </div>
                <div className="w-10"></div>
            </header>

            <div className="p-4 space-y-6">

                {/* Progress Card */}
                <div className="bg-card border border-border p-6 rounded-3xl shadow-sm text-center">
                    <div className="relative h-32 w-32 mx-auto mb-4 flex items-center justify-center">
                        <svg className="h-full w-full rotate-[-90deg]" viewBox="0 0 100 100">
                            <circle className="text-secondary stroke-current" strokeWidth="10" fill="transparent" r="40" cx="50" cy="50" />
                            <circle
                                className="text-green-500 stroke-current transition-all duration-1000 ease-out"
                                strokeWidth="10"
                                strokeLinecap="round"
                                fill="transparent"
                                r="40"
                                cx="50"
                                cy="50"
                                strokeDasharray="251.2"
                                strokeDashoffset={251.2 - (251.2 * progress) / 100}
                            />
                        </svg>
                        <div className="absolute font-black text-2xl">{progress}%</div>
                    </div>
                    <h2 className="font-bold text-lg">Job Readiness Score</h2>
                    <p className="text-xs text-muted-foreground mt-1">Complete all items to ensure 5-star quality.</p>
                </div>

                {/* Checklist */}
                <div>
                    <h3 className="font-bold text-lg mb-3 flex items-center">
                        <ClipboardCheck className="h-5 w-5 mr-2 text-primary" />
                        Standard Checklist
                    </h3>
                    <div className="space-y-3">
                        {checklist.map(item => (
                            <button
                                key={item.id}
                                onClick={() => toggleItem(item.id)}
                                className={cn("w-full p-4 rounded-2xl flex items-center transition-all border",
                                    item.checked ? "bg-green-500/10 border-green-500/30" : "bg-card border-border hover:border-primary/50"
                                )}
                            >
                                <div className={cn("h-6 w-6 rounded-lg border-2 mr-4 flex items-center justify-center transition-colors",
                                    item.checked ? "bg-green-500 border-green-500" : "border-muted-foreground"
                                )}>
                                    {item.checked && <CheckSquare className="h-4 w-4 text-white" />}
                                </div>
                                <span className={cn("font-bold text-sm text-left", item.checked && "text-muted-foreground line-through")}>{item.text}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Photo Evidence */}
                <div>
                    <h3 className="font-bold text-lg mb-3 flex items-center">
                        <Camera className="h-5 w-5 mr-2 text-blue-500" />
                        Photo Evidence
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <button className="aspect-square bg-secondary rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-border hover:bg-secondary/80">
                            <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                            <span className="text-xs font-bold text-muted-foreground">Before Work</span>
                        </button>
                        <button className="aspect-square bg-secondary rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-border hover:bg-secondary/80">
                            <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                            <span className="text-xs font-bold text-muted-foreground">After Work</span>
                        </button>
                    </div>
                </div>

                {progress < 100 && (
                    <div className="bg-orange-500/10 text-orange-600 p-4 rounded-xl flex items-start space-x-3 text-sm font-bold">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <span>Finish checklist to mark job as ready for review.</span>
                    </div>
                )}
            </div>
        </div>
    );
}
