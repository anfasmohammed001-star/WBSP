import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ShieldCheck, Scale, FileCheck, CheckCircle2, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';

export default function ComplianceHub() {
    const navigate = useNavigate();

    return (
        <div className="bg-background min-h-screen pb-20 text-foreground">
            <header className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-secondary">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <h1 className="text-lg font-black">Compliance</h1>
                </div>
                <div className="w-10"></div>
            </header>

            <div className="p-4 space-y-6">

                {/* Status Card */}
                <div className="bg-green-500 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="bg-white/20 p-4 rounded-full mb-3 backdrop-blur-sm">
                            <CheckCircle2 className="h-10 w-10 font-bold" />
                        </div>
                        <h2 className="text-2xl font-black mb-1">Fully Compliant</h2>
                        <p className="text-sm font-medium opacity-90">All your documents are up to date.</p>
                    </div>
                </div>

                {/* Checklist */}
                <div>
                    <h3 className="font-bold text-lg mb-3">Requirements</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-card border border-border rounded-2xl shadow-sm">
                            <div className="flex items-center space-x-3">
                                <Scale className="h-5 w-5 text-blue-500" />
                                <div>
                                    <h4 className="font-bold text-sm">Background Check</h4>
                                    <p className="text-[10px] text-muted-foreground">Passed on Jan 12, 2025</p>
                                </div>
                            </div>
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-card border border-border rounded-2xl shadow-sm">
                            <div className="flex items-center space-x-3">
                                <FileCheck className="h-5 w-5 text-purple-500" />
                                <div>
                                    <h4 className="font-bold text-sm">Insurance Policy</h4>
                                    <p className="text-[10px] text-muted-foreground">Expires Dec 2026</p>
                                </div>
                            </div>
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                        </div>
                    </div>
                </div>

                {/* Alert */}
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-bold text-sm text-yellow-700">Upcoming Regulation Change</h4>
                        <p className="text-xs text-yellow-600 mt-1">Starting next month, all electrical contractors must carry digital ID badges. <span className="underline cursor-pointer">Learn More</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
