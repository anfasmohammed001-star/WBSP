import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Sparkles, MapPin, Clock, ThumbsUp, ThumbsDown, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function SmartMatch() {
    const navigate = useNavigate();
    const [currentCard, setCurrentCard] = useState(0);

    const matches = [
        {
            id: 1,
            title: 'Emergency Pipe Repair',
            customer: 'John Doe',
            distance: '2.5 miles away',
            time: 'ASAP',
            rate: '$85/hr',
            matchScore: 98,
            tags: ['Urgent', 'High Pay']
        },
        {
            id: 2,
            title: 'Bathroom Faucet Install',
            customer: 'Sarah Smith',
            distance: '5 miles away',
            time: 'Tomorrow, 10 AM',
            rate: '$60/hr',
            matchScore: 92,
            tags: ['Scheduled', 'Easy']
        },
        {
            id: 3,
            title: 'Water Heater Check',
            customer: 'Mike Johnson',
            distance: '8 miles away',
            time: 'Fri, 2 PM',
            rate: '$75/hr',
            matchScore: 88,
            tags: ['standard']
        }
    ];

    const handleSwipe = (direction: 'left' | 'right') => {
        // Logic to accept/reject would go here
        setCurrentCard(prev => prev + 1);
    };

    return (
        <div className="bg-background min-h-screen pb-20 text-foreground overflow-hidden">
            {/* Header */}
            <header className="p-4 flex items-center justify-between sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-secondary">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-1 text-purple-600">
                    <Sparkles className="h-5 w-5" />
                    <h1 className="text-lg font-black text-foreground">Smart Match</h1>
                </div>
                <div className="w-10"></div>
            </header>

            <div className="p-4 flex flex-col items-center justify-center h-[80vh] relative">
                <AnimatePresence>
                    {currentCard < matches.length ? (
                        <motion.div
                            key={matches[currentCard].id}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ x: 200, opacity: 0, rotate: 20 }}
                            className="bg-card w-full max-w-sm rounded-[2.5rem] p-6 shadow-xl border-2 border-purple-500/20 relative"
                        >
                            {/* Match Score Badge */}
                            <div className="absolute top-6 right-6 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg shadow-purple-500/30">
                                {matches[currentCard].matchScore}% Match
                            </div>

                            <div className="mt-8 mb-6">
                                <h2 className="text-2xl font-black leading-tight mb-2">{matches[currentCard].title}</h2>
                                <p className="text-muted-foreground font-bold">{matches[currentCard].customer}</p>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center space-x-3 text-sm font-medium">
                                    <div className="bg-secondary p-2 rounded-full">
                                        <MapPin className="h-4 w-4 text-primary" />
                                    </div>
                                    <span>{matches[currentCard].distance}</span>
                                </div>
                                <div className="flex items-center space-x-3 text-sm font-medium">
                                    <div className="bg-secondary p-2 rounded-full">
                                        <Clock className="h-4 w-4 text-orange-500" />
                                    </div>
                                    <span>{matches[currentCard].time}</span>
                                </div>
                                <div className="flex items-center space-x-3 text-sm font-medium">
                                    <div className="bg-secondary p-2 rounded-full">
                                        <span className="font-black text-green-600">$</span>
                                    </div>
                                    <span className="text-lg font-black text-green-600">{matches[currentCard].rate}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-8">
                                {matches[currentCard].tags.map(tag => (
                                    <span key={tag} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-between items-center px-4">
                                <button
                                    onClick={() => handleSwipe('left')}
                                    className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 text-red-500 flex items-center justify-center hover:scale-110 transition-transform"
                                >
                                    <ThumbsDown className="h-8 w-8" />
                                </button>
                                <button className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                                    <Info className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => handleSwipe('right')}
                                    className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 text-green-500 flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-green-500/20"
                                >
                                    <ThumbsUp className="h-8 w-8" />
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="text-center">
                            <div className="bg-secondary/50 p-6 rounded-full inline-block mb-4">
                                <Sparkles className="h-12 w-12 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-bold text-muted-foreground">No more matches</h3>
                            <p className="text-sm opacity-60 mt-2">Check back later for more AI-curated jobs.</p>
                            <button onClick={() => setCurrentCard(0)} className="mt-6 text-primary font-bold hover:underline">
                                Review Again
                            </button>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
