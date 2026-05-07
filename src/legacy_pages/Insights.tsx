import { useNavigate } from 'react-router-dom';
import { ChevronLeft, TrendingUp, PieChart, Calendar, DollarSign } from 'lucide-react';

export default function Insights() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="p-4 flex items-center space-x-2 sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-secondary rounded-full">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <h1 className="text-xl font-black">My Insights</h1>
            </div>

            <div className="p-4 space-y-6">
                {/* Total Spending */}
                <div className="bg-primary/10 rounded-3xl p-6 text-primary flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold opacity-70">Total Spend (2025)</p>
                        <h2 className="text-3xl font-black">$2,450.00</h2>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                        <DollarSign className="h-6 w-6" />
                    </div>
                </div>

                {/* Spending by Category (Mock Chart) */}
                <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center space-x-2 mb-4">
                        <PieChart className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-bold text-lg">Top Categories</h3>
                    </div>
                    <div className="space-y-4">
                        {[
                            { label: 'Plumbing', amount: '$1,200', pct: '50%', color: 'bg-blue-500' },
                            { label: 'Cleaning', amount: '$800', pct: '30%', color: 'bg-green-500' },
                            { label: 'Electrical', amount: '$450', pct: '20%', color: 'bg-yellow-500' },
                        ].map((cat) => (
                            <div key={cat.label} className="space-y-1">
                                <div className="flex justify-between text-sm font-bold">
                                    <span>{cat.label}</span>
                                    <span>{cat.amount}</span>
                                </div>
                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                    <div className={`h-full ${cat.color}`} style={{ width: cat.pct }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Monthly Trend (Mock Chart) */}
                <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center space-x-2 mb-4">
                        <TrendingUp className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-bold text-lg">Monthly Trend</h3>
                    </div>
                    <div className="flex items-end space-x-2 h-40">
                        {/* Simple bar chart using flex */}
                        {[30, 45, 20, 60, 80, 50].map((h, i) => (
                            <div key={i} className="flex-1 bg-secondary rounded-t-lg relative group">
                                <div className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-lg transition-all duration-500" style={{ height: `${h}%` }} />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-2 font-bold uppercase">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                    </div>
                </div>

                {/* Recommendations */}
                <div className="bg-secondary/30 rounded-3xl p-6">
                    <div className="flex items-center space-x-2 mb-2">
                        <Calendar className="h-5 w-5 text-purple-500" />
                        <h3 className="font-bold text-lg text-purple-500">Smart Tip</h3>
                    </div>
                    <p className="text-sm font-medium opacity-80">
                        You spend 30% more on weekends. Try booking on **Tuesdays** to save an average of 15% on quotes!
                    </p>
                </div>
            </div>
        </div>
    );
}
