import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ScanLine, Calculator, CheckCircle2, AlertCircle, RefreshCw, Smartphone } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState } from 'react';

export default function SkillVerification() {
    const navigate = useNavigate();
    const [scanning, setScanning] = useState(false);
    const [step, setStep] = useState<'intro' | 'scan' | 'result'>('intro');

    const handleScan = () => {
        setStep('scan');
        setScanning(true);
        setTimeout(() => {
            setScanning(false);
            setStep('result');
        }, 3000);
    };

    return (
        <div className="bg-background min-h-screen pb-20 text-foreground flex flex-col">
            <header className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-secondary">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-2">
                    <ScanLine className="h-5 w-5 text-primary" />
                    <h1 className="text-lg font-black">Verify Skill</h1>
                </div>
                <div className="w-10"></div>
            </header>

            <div className="flex-1 flex flex-col p-6">

                {step === 'intro' && (
                    <div className="flex flex-col items-center justify-center flex-1 text-center space-y-6">
                        <div className="h-40 w-40 bg-secondary rounded-full flex items-center justify-center">
                            <Smartphone className="h-20 w-20 text-muted-foreground animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black mb-2">Automated Verification</h2>
                            <p className="text-muted-foreground font-medium">
                                Take a clear photo of your professional license or certificate. Our AI will verify it instantly.
                            </p>
                        </div>
                        <div className="bg-yellow-500/10 text-yellow-600 p-4 rounded-xl text-sm font-bold flex items-start text-left">
                            <AlertCircle className="h-5 w-5 mr-3 shrink-0" />
                            <span>Ensure good lighting and that all text is readable.</span>
                        </div>
                        <button onClick={handleScan} className="w-full bg-primary text-primary-foreground h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/30 mt-auto">
                            Start Scan
                        </button>
                    </div>
                )}

                {step === 'scan' && (
                    <div className="flex-1 flex flex-col items-center justify-center bg-black rounded-3xl overflow-hidden relative">
                        {/* Camera UI Mock */}
                        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/50 to-transparent z-10" />
                        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent z-10 flex flex-col items-center justify-center">
                            <p className="text-white font-bold mb-4">Align document within frame</p>
                        </div>

                        {/* Scanner Line Animation */}
                        <div className="w-full h-1 bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.8)] absolute top-0 animate-[scan_2s_infinite_linear]" />

                        <style>{`
                            @keyframes scan {
                                0% { top: 0; opacity: 0; }
                                10% { opacity: 1; }
                                90% { opacity: 1; }
                                100% { top: 100%; opacity: 0; }
                            }
                         `}</style>

                        <div className="w-[80%] h-[60%] border-2 border-white/50 rounded-2xl relative">
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white -mt-1 -ml-1 rounded-tl-xl" />
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white -mt-1 -mr-1 rounded-tr-xl" />
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white -mb-1 -ml-1 rounded-bl-xl" />
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white -mb-1 -mr-1 rounded-br-xl" />
                        </div>
                    </div>
                )}

                {step === 'result' && (
                    <div className="flex flex-col items-center justify-center flex-1 text-center space-y-6">
                        <div className="h-32 w-32 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 className="h-16 w-16 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black mb-2 text-green-600">Verification Successful</h2>
                            <p className="text-muted-foreground font-medium">
                                "Certified Master Plumber" has been added to your profile.
                            </p>
                        </div>
                        <div className="bg-card border border-border p-4 rounded-xl w-full text-left">
                            <div className="text-xs font-bold text-muted-foreground uppercase mb-1">Detected Data</div>
                            <div className="font-bold">License #: 982-12-4412</div>
                            <div className="font-bold">Exp: 12/2026</div>
                        </div>
                        <button onClick={() => navigate(-1)} className="w-full bg-secondary text-foreground h-14 rounded-2xl font-black text-lg mt-auto">
                            Done
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
