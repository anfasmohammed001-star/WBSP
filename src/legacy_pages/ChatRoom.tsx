import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, MoreVertical, Phone, Video, Send, Paperclip, Smile } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatRoom() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [messages, setMessages] = useState([
        { id: 1, text: 'Hi! I saw your job post about the kitchen sink.', sender: 'them', time: '10:30 AM' },
        { id: 2, text: 'Yes, it is leaking quite bad.', sender: 'me', time: '10:32 AM' },
        { id: 3, text: 'I can be there in about 20 minutes.', sender: 'them', time: '10:35 AM' },
        { id: 4, text: 'That would be great, thanks!', sender: 'me', time: '10:36 AM' },
        { id: 5, text: 'I will be there in 10 mins.', sender: 'them', time: '10:42 AM' },
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { id: Date.now(), text: input, sender: 'me', time: 'Now' }]);
        setInput('');
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <div className="p-3 flex items-center justify-between bg-card border-b border-border sticky top-0 z-10 shadow-sm">
                <div className="flex items-center space-x-3">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-secondary rounded-full">
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <img src="https://i.pravatar.cc/150?u=mario" alt="User" className="w-10 h-10 rounded-full object-cover" />
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-card" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">Mario S.</h3>
                            <p className="text-[10px] text-green-500 font-bold">Online</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-1">
                    <button className="p-2 hover:bg-secondary rounded-full"><Phone className="h-5 w-5" /></button>
                    <button className="p-2 hover:bg-secondary rounded-full"><Video className="h-5 w-5" /></button>
                    <button className="p-2 hover:bg-secondary rounded-full"><MoreVertical className="h-5 w-5" /></button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/10">
                {messages.map((msg) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={msg.id}
                        className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${msg.sender === 'me'
                                    ? 'bg-primary text-primary-foreground rounded-tr-none'
                                    : 'bg-white dark:bg-card border border-border rounded-tl-none'
                                }`}
                        >
                            <p>{msg.text}</p>
                            <p className={`text-[10px] mt-1 text-right ${msg.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                {msg.time}
                            </p>
                        </div>
                    </motion.div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-card border-t border-border sticky bottom-0 z-10 pb-6 md:pb-3">
                <div className="flex items-center space-x-2 bg-secondary/50 p-1.5 rounded-full border border-border">
                    <button className="p-2 text-muted-foreground hover:text-primary rounded-full transition-colors">
                        <Smile className="h-5 w-5" />
                    </button>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent text-sm focus:outline-none px-2"
                    />
                    <button className="p-2 text-muted-foreground hover:text-primary rounded-full transition-colors">
                        <Paperclip className="h-5 w-5" />
                    </button>
                    <button
                        onClick={handleSend}
                        className={`p-2 rounded-full transition-all ${input.trim() ? 'bg-primary text-primary-foreground' : 'bg-gray-200 dark:bg-zinc-700 text-gray-400'}`}
                        disabled={!input.trim()}
                    >
                        <Send className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
