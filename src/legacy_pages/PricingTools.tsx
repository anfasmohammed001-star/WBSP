import { useNavigate } from 'react-router-dom';
import { ChevronLeft, DollarSign, TrendingUp, MapPin, Calculator } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState } from 'react';

export default function PricingTools() {
    const navigate = useNavigate();
    const [rate, setRate] = useState(85);

    return (
        <div className="bg-background min-h-screen pb-20 text-foreground">
            <header className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-secondary">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    <h1 className="text-lg font-black">Dynamic Pricing</h1>
                </div>
                <div className="w-10"></div>
            </header>

            <div className="p-4 space-y-6">

                {/* Demand Heatmap Card */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="flex items-center space-x-2 mb-1">
                                <TrendingUp className="h-5 w-5 text-green-400" />
                                <h2 className="font-black text-lg">High Demand</h2>
                            </div>
                            <p className="text-sm opacity-90 font-medium">Demand is <span className="text-green-300 font-bold">+25%</span> in your area today.</p>
                        </div>
                        <div className="bg-white/20 p-2 rounded-xl">
                            <MapPin className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 text-xs font-medium leading-relaxed">
                        <span className="font-bold text-yellow-300">Suggestion:</span> Consider increasing your rate by $5-$10/hr for new jobs posted today.
                    </div>
                </div>

                {/* Rate Calculator */}
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center space-x-2 mb-6">
                        <Calculator className="h-5 w-5 text-primary" />
                        <h3 className="font-bold text-lg">Rate Calculator</h3>
                    </div>

                    <div className="flex flex-col items-center space-y-4">
                        <div className="text-5xl font-black text-foreground">${rate}</div>
                        <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Per Hour</div>

                        <input
                            type="range"
                            min="40"
                            max="200"
                            step="5"
                            value={rate}
                            onChange={(e) => setRate(parseInt(e.target.value))}
                            className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                        />

                        <div className="flex w-full justify-between text-xs font-bold text-muted-foreground">
                            <span>$40</span>
                            <span>$200</span>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-border grid grid-cols-2 gap-4 text-center">
                        <div>
                            <div className="text-xs text-muted-foreground font-bold mb-1">Market Avg</div>
                            <div className="font-black text-lg text-foreground">$75</div>
                        </div>
                        <div>
                            <div className="text-xs text-muted-foreground font-bold mb-1">Estimated Earnings</div>
                            <div className="font-black text-lg text-green-600">${rate * 30}/wk</div>
                        </div>
                    </div>
                </div>

                <button className="w-full bg-primary text-primary-foreground h-14 rounded-2xl font-black shadow-lg">
                    Update My Public Rate
                </button>
            </div>
        </div>
    );
}
