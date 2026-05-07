import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Phone, Video, ChevronLeft, Mic, Play, Pause, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    id: string;
    text?: string;
    sender: 'me' | 'them';
    time: string;
    isVoice?: boolean;
    duration?: string;
    transcription?: string;
}

import { useNavigate } from 'react-router-dom';

export default function Chat() {
    const navigate = useNavigate();
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: 'Hi Alexander, I saw your post regarding the pipe burst. I can be there in 20 minutes.', sender: 'them', time: '10:00 AM' },
        { id: '2', isVoice: true, duration: '0:45', sender: 'them', time: '10:02 AM', transcription: 'I have all the tools ready. Please send the exact location.' },
        { id: '3', text: 'That would be great! The water is currently off but I need it fixed ASAP.', sender: 'me', time: '10:03 AM' },
    ]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, {
            id: Date.now().toString(),
            text: input,
            sender: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setInput('');
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-background text-foreground transition-colors duration-300 max-w-md mx-auto shadow-2xl overflow-hidden border-x border-border">
            {/* Job Context Header (Image 12) */}
            <div className="bg-primary/5 px-6 py-3 flex justify-between items-center border-b border-primary/10">
                {/* ... existing header content ... */}
                <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black tracking-widest uppercase text-primary/60">Current Job Context</h4>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-bold text-foreground">Emergency Pipe Burst</span>
                            <span className="text-sm font-black text-primary">$150.00</span>
                        </div>
                    </div>
                </div>
                <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">View Details</button>
            </div>

            {/* Main Header */}
            <div className="px-6 py-4 flex items-center justify-between bg-card border-b border-border shrink-0">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                    </button>
                    <div className="relative">
                        <div className="h-12 w-12 rounded-2xl overflow-hidden border border-border">
                            <img src="https://i.pravatar.cc/150?u=sarah" alt="Sarah" className="h-full w-full object-cover" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-card" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black tracking-tight text-foreground">Sarah Sterling</h3>
                        <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Active Now</p>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button className="p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors">
                        <Video className="h-5 w-5 text-muted-foreground" />
                    </button>
                    <button className="p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-8 bg-background no-scrollbar"
            >
                {messages.map((m) => (
                    <div key={m.id} className={cn("flex w-full", m.sender === 'me' ? "justify-end" : "justify-start")}>
                        <div className={cn("max-w-[85%] space-y-1", m.sender === 'me' ? "items-end" : "items-start")}>
                            {m.isVoice ? (
                                <VoiceBubble message={m} />
                            ) : (
                                <motion.div
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className={cn(
                                        "px-5 py-3 rounded-3xl text-sm font-medium leading-relaxed shadow-sm",
                                        m.sender === 'me'
                                            ? "bg-primary text-primary-foreground rounded-tr-none shadow-primary/20"
                                            : "bg-card border border-border text-foreground rounded-tl-none"
                                    )}
                                >
                                    <p>{m.text}</p>
                                </motion.div>
                            )}
                            <div className={cn("text-[10px] font-bold px-1", m.sender === 'me' ? "text-primary/60" : "text-muted-foreground")}>
                                {m.time}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-card border-t border-border shrink-0">
                <div className="flex items-center space-x-3 bg-secondary/50 rounded-3xl px-4 py-2 border border-border">
                    <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                        <Paperclip className="h-5 w-5" />
                    </button>
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-foreground placeholder:text-muted-foreground h-12"
                    />
                    <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                        <Mic className="h-5 w-5" />
                    </button>
                    <Button
                        size="icon"
                        onClick={handleSend}
                        className="h-10 w-10 shrink-0 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    >
                        <Send className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Bottom Safe Area */}
            <div className="h-6 shrink-0" />
        </div>
    );
}

function VoiceBubble({ message }: { message: Message }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [showTranscription, setShowTranscription] = useState(false);

    return (
        <div className="space-y-2">
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-card border border-border rounded-3xl rounded-tl-none p-4 shadow-sm w-[260px]"
            >
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 shrink-0"
                    >
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                    </button>

                    <div className="flex-1 flex flex-col justify-center space-y-2">
                        {/* Waveform Visualization Placeholder */}
                        <div className="flex items-center space-x-1 h-6">
                            {[1, 0.4, 0.7, 0.3, 0.8, 0.5, 0.9, 0.2, 0.6, 0.4, 0.7, 0.3, 0.8].map((h, i) => (
                                <motion.div
                                    key={i}
                                    animate={isPlaying ? { height: [h * 24, (1 - h) * 24, h * 24] } : { height: h * 20 }}
                                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                                    className="w-1 bg-primary/40 rounded-full"
                                    style={{ height: h * 20 }}
                                />
                            ))}
                        </div>
                        <div className="flex justify-between text-[9px] font-black text-muted-foreground">
                            <span>0:00</span>
                            <span>{message.duration}</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            <button
                onClick={() => setShowTranscription(!showTranscription)}
                className="text-[9px] font-black text-primary uppercase tracking-[0.2em] px-4"
            >
                {showTranscription ? "Hide Transcription" : "Transcribe"}
            </button>

            <AnimatePresence>
                {showTranscription && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-secondary/50 rounded-2xl p-3 border border-border text-[11px] font-bold text-muted-foreground italic max-w-[260px]"
                    >
                        "{message.transcription}"
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
