import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, DollarSign, Star, MapPin, ExternalLink, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

export default function WorkerJobHistory() {
    const navigate = useNavigate();

    const jobs = [
        {
            id: '101',
            title: 'Leaking Faucet Repair',
            customer: 'Alice Wonderland',
            date: 'Jan 15, 2024',
            time: '14:30',
            duration: '1h 15m',
            earnings: 85.00,
            rating: 5,
            location: 'Downtown, Apt 4B',
            status: 'COMPLETED'
        },
        {
            id: '102',
            title: 'Kitchen Sink Install',
            customer: 'Bob Builder',
            date: 'Jan 12, 2024',
            time: '09:00',
            duration: '2h 00m',
            earnings: 150.00,
            rating: 4,
            location: 'Suburbs, 123 Maple St',
            status: 'COMPLETED'
        },
        {
            id: '103',
            title: 'Pipe Inspection',
            customer: 'Charlie Chocolate',
            date: 'Jan 10, 2024',
            time: '16:45',
            duration: '45m',
            earnings: 60.00,
            rating: 5,
            location: 'Factory Ln, Unit 9',
            status: 'COMPLETED'
        },
        {
            id: '104',
            title: 'Emergency Shutoff',
            customer: 'Daisy Duck',
            date: 'Jan 08, 2024',
            time: '02:00',
            duration: '30m',
            earnings: 120.00,
            rating: 5,
            location: 'Lake House',
            status: 'COMPLETED'
        },
    ];

    return (
        <div className="bg-background min-h-screen pb-20 text-foreground">
            {/* Header */}
            <header className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-secondary">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <div className="text-center">
                    <h1 className="font-extrabold text-lg">Job History</h1>
                    <p className="text-[10px] text-muted-foreground font-bold">Total Earnings: $415.00</p>
                </div>
                <div className="w-10"></div>
            </header>

            <div className="p-4 space-y-4">
                {jobs.map((job) => (
                    <div key={job.id} className="bg-card rounded-2xl p-5 shadow-sm border border-border group hover:border-primary/50 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-foreground text-base">{job.title}</h3>
                                <div className="flex items-center text-xs text-muted-foreground mt-1">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {job.location}
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="font-black text-lg text-primary">${job.earnings.toFixed(2)}</span>
                                <span className={cn(
                                    "text-[10px] uppercase font-bold px-2 py-0.5 rounded-full mt-1",
                                    job.rating === 5 ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"
                                )}>
                                    {job.status}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-secondary/30 p-2 rounded-xl">
                                <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">Customer</span>
                                <span className="text-xs font-bold">{job.customer}</span>
                            </div>
                            <div className="bg-secondary/30 p-2 rounded-xl">
                                <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">Date & Time</span>
                                <span className="text-xs font-bold flex items-center">
                                    <Calendar className="h-3 w-3 mr-1 opacity-50" /> {job.date}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-border">
                            <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={cn("h-4 w-4", i < job.rating ? "fill-yellow-400 text-yellow-400" : "text-border")}
                                    />
                                ))}
                            </div>
                            <button className="text-xs font-bold text-primary flex items-center hover:underline">
                                Details <ExternalLink className="h-3 w-3 ml-1" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center p-6 text-muted-foreground text-xs">
                Showing last 30 days
            </div>
        </div>
    );
}
