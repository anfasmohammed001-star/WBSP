import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, X, Check, Download, Share2, ChevronLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';

interface Job {
    id: number;
    title: string;
    date: string;
    status: string;
    price: string;
}

const HistoryItem = ({ item, onViewReceipt }: { item: Job; onViewReceipt: (job: Job) => void }) => (
    <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col gap-2 hover:border-primary/50 transition-colors">
        <div className="flex justify-between items-start">
            <h3 className="font-bold text-foreground">{item.title}</h3>
            <span className="px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-xs rounded-full font-medium">{item.status}</span>
        </div>
        <div className="flex items-center text-xs text-muted-foreground gap-4">
            <div className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> {item.date}</div>
            <div className="flex items-center font-semibold text-foreground">{item.price}</div>
        </div>
        <Button variant="outline" size="sm" className="mt-2 text-xs h-8" onClick={() => onViewReceipt(item)}>View Receipt</Button>
    </div>
);

const ReceiptModal = ({ job, onClose }: { job: Job; onClose: () => void }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-card w-full max-w-sm rounded-3xl shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Receipt Header */}
            <div className="bg-primary/5 p-6 text-center border-b border-border/50 relative">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors">
                    <X className="h-4 w-4 text-muted-foreground" />
                </button>
                <div className="flex flex-col items-center gap-2">
                    <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 rotate-3">
                        <span className="text-primary-foreground font-black text-xl">W</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-black tracking-widest text-foreground uppercase">WBSP</h2>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Official Receipt</p>
                    </div>
                </div>
            </div>

            {/* Receipt Body */}
            <div className="p-6 space-y-6">
                <div className="space-y-1 text-center">
                    <div className="text-3xl font-extrabold text-foreground">{job.price}</div>
                    <div className="text-sm font-medium text-muted-foreground">Payment Success</div>
                </div>

                <div className="space-y-4 text-sm">
                    <div className="flex justify-between py-2 border-b border-border/50">
                        <span className="text-muted-foreground">Job Title</span>
                        <span className="font-bold text-foreground">{job.title}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/50">
                        <span className="text-muted-foreground">Date</span>
                        <span className="font-bold text-foreground">{job.date}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/50">
                        <span className="text-muted-foreground">Payment Method</span>
                        <span className="font-bold text-foreground">Visa ending in 4242</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/50">
                        <span className="text-muted-foreground">Transaction ID</span>
                        <span className="font-mono text-xs font-medium text-muted-foreground">TXN-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                    </div>
                </div>

                {/* Seal */}
                <div className="flex justify-center py-4">
                    <div className="relative group cursor-default">
                        <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl group-hover:bg-green-500/30 transition-colors" />
                        <div className="relative border-2 border-green-500/30 text-green-600 dark:text-green-400 px-6 py-2 rounded-full flex items-center gap-2 bg-green-500/5">
                            <Check className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Verified Payment</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                    <Button
                        variant="outline"
                        className="w-full text-xs"
                        onClick={() => {
                            toast.success('Receipt downloaded (PDF)', { icon: '📄' });
                        }}
                    >
                        <Download className="h-3.5 w-3.5 mr-2" />
                        Download PDF
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full text-xs"
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({
                                    title: `Receipt for ${job.title}`,
                                    text: `Receipt for ${job.title} - ${job.price} on ${job.date}`,
                                }).catch(console.error);
                            } else {
                                toast.success('Link copied to clipboard');
                            }
                        }}
                    >
                        <Share2 className="h-3.5 w-3.5 mr-2" />
                        Share
                    </Button>
                </div>
            </div>
        </div>
    </div>
);



export default function JobHistory() {
    const navigate = useNavigate();
    const [selectedReceipt, setSelectedReceipt] = useState<Job | null>(null);

    const history: Job[] = [
        { id: 1, title: 'Lawn Mowing', date: 'Oct 15, 2023', status: 'Completed', price: '$45.00' },
        { id: 2, title: 'Faucet Repair', date: 'Sep 28, 2023', status: 'Completed', price: '$85.00' },
        { id: 3, title: 'House Cleaning', date: 'Sep 10, 2023', status: 'Completed', price: '$120.00' },
    ];

    return (
        <div className="p-4 space-y-4 max-w-md mx-auto min-h-screen bg-background text-foreground shadow-2xl overflow-hidden border-x border-border">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-xl bg-card border border-border shadow-sm hover:bg-secondary transition-colors"
                >
                    <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                </button>
                <h1 className="text-2xl font-bold">Job History</h1>
            </div>
            <div className="space-y-4">
                {history.map(item => (
                    <HistoryItem key={item.id} item={item} onViewReceipt={setSelectedReceipt} />
                ))}
            </div>

            {selectedReceipt && (
                <ReceiptModal job={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
            )}
        </div>
    );
}
