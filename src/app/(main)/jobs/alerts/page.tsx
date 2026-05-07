import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, BellRing, Clock, MapPin, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function JobAlerts() {
    const navigate = useNavigate();
    const [alerts, setAlerts] = useState([
        { id: 1, title: 'New Plumbing Job', desc: 'Leaky faucet in Downtown', time: '2m ago', urgent: true },
        { id: 2, title: 'Job Cancelled', desc: 'Mrs. Davis cancelled appointment', time: '15m ago', urgent: false },
        { id: 3, title: 'Payment Received', desc: 'You received $150.00', time: '1h ago', urgent: false },
        { id: 4, title: 'New Review', desc: '5 stars from Bob Builder', time: '3h ago', urgent: false },
    ]);

    const removeAlert = (id: number) => {
        setAlerts(alerts.filter(a => a.id !== id));
    };

    return (
        <div className="bg-background min-h-screen pb-20 text-foreground">
            {/* Header */}
            <header className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-secondary">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-2">
                    <BellRing className="h-5 w-5 text-primary" />
                    <h1 className="text-lg font-black">Live Alerts</h1>
                </div>
                <div className="w-10"></div>
            </header>

            <div className="p-4 space-y-3">
                {alerts.length === 0 && (
                    <div className="text-center py-20 opacity-50">
                        <Bell className="h-12 w-12 mx-auto mb-4 stroke-1" />
                        <p>No new alerts.</p>
                    </div>
                )}

                {alerts.map(alert => (
                    <div key={alert.id} className={cn("relative bg-card border border-border p-4 rounded-2xl shadow-sm flex items-start space-x-4", alert.urgent && "border-l-4 border-l-red-500")}>
                        <div className={cn("h-10 w-10 rounded-full flex items-center justify-center shrink-0", alert.urgent ? "bg-red-500/10 text-red-500" : "bg-secondary text-muted-foreground")}>
                            {alert.urgent ? <BellRing className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-sm">{alert.title}</h4>
                                <span className="text-[10px] text-muted-foreground font-medium">{alert.time}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{alert.desc}</p>

                            {alert.urgent && (
                                <button className="mt-3 bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-red-600 transition-colors">
                                    View Details
                                </button>
                            )}
                        </div>
                        <button onClick={() => removeAlert(alert.id)} className="text-muted-foreground hover:text-foreground">
                            <X className="h-4 w-4 opacity-50" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
