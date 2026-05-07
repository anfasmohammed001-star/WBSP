import { useRef, useEffect, useState } from 'react';
import { ChevronLeft, Camera, RotateCcw, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ARVisualizer() {
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [selectedObject, setSelectedObject] = useState<string | null>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const startCamera = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                setError("Camera access denied or unavailable. Using simulation mode.");
            }
        };

        startCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const objects = [
        { id: 'couch', name: 'Sofa', icon: '🛋️' },
        { id: 'lamp', name: 'Lamp', icon: '💡' },
        { id: 'plant', name: 'Plant', icon: '🪴' },
        { id: 'clean', name: 'Clean Spot', icon: '✨' },
    ];

    return (
        <div className="h-screen bg-black relative overflow-hidden">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-black/30 backdrop-blur-md text-white">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <h1 className="text-white font-bold text-lg drop-shadow-md">AR Preview</h1>
                <div className="w-10" />
            </div>

            {/* Camera View */}
            {error ? (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-800">
                    <div className="text-center p-6">
                        <Camera className="h-12 w-12 text-zinc-500 mx-auto mb-4" />
                        <p className="text-zinc-400">{error}</p>
                        <img
                            src="https://images.unsplash.com/photo-1584622781867-151784ac0e90?auto=format&fit=crop&w=800&q=80"
                            alt="Room"
                            className="absolute inset-0 w-full h-full object-cover opacity-20 -z-10"
                        />
                    </div>
                </div>
            ) : (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                />
            )}

            {/* AR Overlays (Simulated) */}
            {selectedObject && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    drag
                    dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
                >
                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-3xl border-2 border-white/50 shadow-2xl relative">
                        <div className="text-6xl">{objects.find(o => o.id === selectedObject)?.icon}</div>
                        {selectedObject === 'clean' && (
                            <div className="absolute inset-0 bg-blue-400/30 blur-xl rounded-full animate-pulse" />
                        )}
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white text-xs font-bold drop-shadow-md whitespace-nowrap">
                            Drag to position
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex justify-center space-x-6 mb-8">
                    {objects.map((obj) => (
                        <button
                            key={obj.id}
                            onClick={() => setSelectedObject(obj.id)}
                            className={`flex flex-col items-center space-y-2 transition-transform ${selectedObject === obj.id ? 'scale-110' : 'opacity-70'}`}
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-md border border-white/20 ${selectedObject === obj.id ? 'bg-primary text-primary-foreground' : 'bg-black/40 text-white'}`}>
                                {obj.icon}
                            </div>
                            <span className="text-white text-[10px] font-bold">{obj.name}</span>
                        </button>
                    ))}
                </div>

                <div className="flex justify-center items-center space-x-8">
                    <button onClick={() => setSelectedObject(null)} className="p-4 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md">
                        <RotateCcw className="h-6 w-6" />
                    </button>
                    <button className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-md transition-all active:scale-95">
                        <div className="w-16 h-16 rounded-full bg-white" />
                    </button>
                    <button className="p-4 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30">
                        <Check className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </div>
    );
}
