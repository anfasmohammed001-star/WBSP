import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, Check, Clock, CreditCard, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

export default function Notifications() {
    const navigate = useNavigate();

    const notifications = [
        { id: 1, type: 'success', title: 'Job Completed', message: 'Your plumbing job with Mario S. has been marked as complete.', time: '2 mins ago', icon: Check, color: 'bg-green-500' },
        { id: 2, type: 'info', title: 'Worker Arriving', message: 'Mario S. is 5 minutes away from your location.', time: '10 mins ago', icon: Clock, color: 'bg-blue-500' },
        { id: 3, type: 'payment', title: 'Payment Successful', message: 'You paid $150.00 via Credit Card.', time: '1 hour ago', icon: CreditCard, color: 'bg-purple-500' },
        { id: 4, type: 'alert', title: 'Security Alert', message: 'New login detected from Chrome on Windows.', time: 'Yesterday', icon: ShieldAlert, color: 'bg-orange-500' },
        { id: 5, type: 'info', title: 'Welcome to WBSP', message: 'Thanks for joining! Start by posting your first job.', time: '2 days ago', icon: Bell, color: 'bg-primary' },
    ];

    return (
        <div className="bg-background min-h-screen pb-10 text-foreground">
            <header className="p-4 flex items-center space-x-4 sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-xl hover:bg-secondary transition-colors"
                >
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <h1 className="text-lg font-bold">Notifications</h1>
            </header>

            <div className="p-4 space-y-4">
                {notifications.map((notif, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={notif.id}
                        className="bg-card p-4 rounded-2xl border border-border flex items-start space-x-4 shadow-sm"
                    >
                        <div className={cn("p-2.5 rounded-full shrink-0 text-white shadow-md", notif.color)}>
                            <notif.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-foreground text-sm">{notif.title}</h3>
                                <span className="text-[10px] text-muted-foreground font-medium">{notif.time}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{notif.message}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="text-center mt-8">
                <button className="text-xs text-muted-foreground hover:text-primary transition-colors">
                    Mark all as read
                </button>
            </div>
        </div>
    );
}
