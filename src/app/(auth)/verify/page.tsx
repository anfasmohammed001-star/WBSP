import React from 'react';
import { ArrowLeft, Camera, Zap, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function VerifyPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#020817] text-white flex flex-col relative overflow-hidden">
            {/* Top Bar */}
            <header className="flex justify-between items-center p-6 z-10">
                <button onClick={() => navigate(-1)} className="p-2 bg-white/10 rounded-full backdrop-blur-md">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="bg-white/10 px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-xs font-medium">Secure Connection</span>
                </div>
                <button className="p-2 bg-white/10 rounded-full backdrop-blur-md">
                    <Zap className="w-6 h-6 text-yellow-400" />
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center relative px-6 z-10">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold mb-2">Identity Verification</h1>
                    <p className="text-slate-400">Scan the front of your ID card</p>
                </div>

                {/* Camera Frame */}
                <div className="w-full max-w-sm aspect-[3/4] rounded-3xl border border-white/20 bg-black/50 relative overflow-hidden shadow-premium">
                    {/* Simulating Camera Feed */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80"></div>

                    {/* Scan Frame Overlay */}
                    <div className="absolute inset-8 border-2 border-white/30 rounded-xl relative">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-xl"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-xl"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-xl"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-xl"></div>

                        {/* Scanning Line */}
                        <div className="absolute top-0 left-0 w-full h-0.5 bg-blue-500 shadow-[0_0_15px_#3b82f6] animate-[scan_2s_ease-in-out_infinite]"></div>
                    </div>

                    {/* Floating Icon */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20">
                        <FileText className="w-24 h-24 text-white" />
                    </div>
                </div>

                <div className="mt-8 bg-white/5 py-2 px-4 rounded-full border border-white/10">
                    <p className="text-sm text-slate-300">Auto-capture is on</p>
                </div>
            </main>

            {/* Bottom Controls */}
            <footer className="p-8 flex justify-center z-10">
                <button className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-transform active:scale-95">
                    <div className="w-16 h-16 bg-white rounded-full"></div>
                </button>
            </footer>

            {/* CSS for Scan Animation */}
            <style>{`
        @keyframes scan {
            0% { top: 0; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
      `}</style>
        </div>
    );
}
