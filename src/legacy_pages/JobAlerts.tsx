import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, BellRing, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';
import { jobService } from '@/services/jobService';

export default function JobAlerts() {
    const navigate = useNavigate();
    const [alerts, setAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                // In a real app, 'posted' jobs that match worker criteria
                const jobs = await jobService.getJobsByStatus('posted');

                // Transform jobs to alerts
                const newAlerts = jobs.map((job: any) => ({
                    id: job.id,
                    title: `New ${job.category} Job`,
                    desc: job.title,
                    time: 'Just now',
                    urgent: job.urgency_level === 'High',
                    type: 'job'
                }));

                // Add some mock notifications for realism
                const mockAlerts = [
                    { id: 991, title: 'Payment Received', desc: 'You received $150.00', time: '1h ago', urgent: false, type: 'notification' },
                    { id: 992, title: 'New Review', desc: '5 stars from Bob Builder', time: '3h ago', urgent: false, type: 'notification' },
                ];

                setAlerts([...newAlerts, ...mockAlerts]);
            } catch (error) {
                console.error("Error fetching alerts", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAlerts();
    }, []);

    const removeAlert = (id: any) => {
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
                {loading ? (
                    <div className="text-center py-10 opacity-50">Loading alerts...</div>
                ) : alerts.length === 0 ? (
                    <div className="text-center py-20 opacity-50">
                        <Bell className="h-12 w-12 mx-auto mb-4 stroke-1" />
                        <p>No new alerts.</p>
                    </div>
                ) : (
                    alerts.map(alert => (
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

                                {alert.type === 'job' && (
                                    <button
                                        onClick={() => navigate(`/worker/offer/${alert.id}`)}
                                        className="mt-3 bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-red-600 transition-colors"
                                    >
                                        View Details
                                    </button>
                                )}
                            </div>
                            <button onClick={() => removeAlert(alert.id)} className="text-muted-foreground hover:text-foreground">
                                <X className="h-4 w-4 opacity-50" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
