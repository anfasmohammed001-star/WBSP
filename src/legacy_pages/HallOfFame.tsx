import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Crown, Trophy, Star as StarIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

export default function HallOfFame() {
    const navigate = useNavigate();

    const topWorkers = [
        { id: 1, name: 'Alice Smith', role: 'Electrician', earned: '$12k', jobs: 145, rating: 5.0, avatar: 'https://i.pravatar.cc/150?u=alice' },
        { id: 2, name: 'Bob Jones', role: 'Plumber', earned: '$11.5k', jobs: 132, rating: 4.9, avatar: 'https://i.pravatar.cc/150?u=bob' },
        { id: 3, name: 'Charlie Day', role: 'Cleaner', earned: '$10k', jobs: 200, rating: 4.9, avatar: 'https://i.pravatar.cc/150?u=charlie' },
    ];

    return (
        <div className="bg-background min-h-screen pb-20 text-foreground">
            {/* Header */}
            <header className="bg-gradient-to-b from-indigo-900 to-indigo-600 pb-12 pt-4 px-4 text-white rounded-b-[3rem] shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-6 relative z-10">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md">
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <h1 className="text-lg font-black">Hall of Fame</h1>
                    <div className="w-10"></div>
                </div>

                <div className="text-center relative z-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-block p-4 bg-gradient-to-tr from-yellow-300 to-yellow-600 rounded-full shadow-lg shadow-yellow-500/50 mb-3"
                    >
                        <Crown className="h-10 w-10 text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-black mb-1">Top Performers</h2>
                    <p className="opacity-80 font-medium text-sm">Recognizing the best of the best this month.</p>
                </div>

                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            </header>

            <div className="p-4 -mt-8 relative z-20 space-y-4">
                {/* Top 3 Podium Cards */}
                {topWorkers.map((worker, index) => (
                    <motion.div
                        key={worker.id}
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-card rounded-[2rem] p-4 flex items-center shadow-lg border border-border"
                    >
                        <div className="relative mr-4 shrink-0">
                            <img src={worker.avatar} alt={worker.name} className="h-16 w-16 rounded-2xl object-cover" />
                            <div className={cn(
                                "absolute -top-3 -left-3 h-8 w-8 rounded-full flex items-center justify-center font-black text-white shadow-md border-2 border-white",
                                index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-orange-600"
                            )}>
                                {index + 1}
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-black text-lg truncate">{worker.name}</h3>
                            <p className="text-sm text-primary font-bold">{worker.role}</p>
                            <div className="flex items-center space-x-3 mt-1 text-xs font-medium text-muted-foreground">
                                <span className="flex items-center"><Trophy className="h-3 w-3 mr-1 text-yellow-500" /> {worker.jobs} Jobs</span>
                                <span className="flex items-center"><StarIcon className="h-3 w-3 mr-1 text-yellow-500" /> {worker.rating}</span>
                            </div>
                        </div>
                        <div className="text-right pl-2">
                            <span className="block font-black text-lg text-green-600">{worker.earned}</span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Earned</span>
                        </div>
                    </motion.div>
                ))}

                {/* More List */}
                <div className="pt-6">
                    <h3 className="font-bold text-lg mb-4 ml-2">Rising Stars</h3>
                    <div className="space-y-3">
                        {[4, 5, 6, 7].map(i => (
                            <div key={i} className="flex items-center p-3 rounded-2xl hover:bg-secondary transition-colors cursor-pointer">
                                <span className="w-8 font-black text-muted-foreground text-center">{i}</span>
                                <img src={`https://i.pravatar.cc/150?u=${i}`} className="h-10 w-10 rounded-full mx-3 border border-border" />
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm">Alex Worker</h4>
                                    <p className="text-[10px] text-muted-foreground">HVAC Specialist</p>
                                </div>
                                <div className="font-bold text-sm">4.8 <StarIcon className="h-3 w-3 inline text-yellow-500 -mt-0.5" /></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
