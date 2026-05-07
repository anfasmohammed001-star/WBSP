'use client';

import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Star, Clock, Briefcase, DollarSign, CheckCircle2, Trophy } from 'lucide-react';

export default function CompareWorkers() {
    const navigate = useNavigate();

    const workers = [
        {
            id: 1,
            name: 'Mario S.',
            role: 'Plumber',
            image: 'https://i.pravatar.cc/150?u=mario',
            rating: 4.9,
            jobs: 142,
            rate: '$45/hr',
            response: '< 10 min',
            badges: ['Top Rated', 'Expert'],
            skills: ['Pipe Repair', 'Installation', 'Emergency']
        },
        {
            id: 2,
            name: 'Luigi B.',
            role: 'Plumber',
            image: 'https://i.pravatar.cc/150?u=luigi',
            rating: 4.7,
            jobs: 98,
            rate: '$38/hr',
            response: '< 30 min',
            badges: ['Reliable'],
            skills: ['Pipe Repair', 'Drainage']
        },
        {
            id: 3,
            name: 'Peach T.',
            role: 'Plumber',
            image: 'https://i.pravatar.cc/150?u=peach',
            rating: 5.0,
            jobs: 215,
            rate: '$55/hr',
            response: '< 5 min',
            badges: ['Elite', 'Fast'],
            skills: ['Full System', 'Luxury Fixtures', 'Consultation']
        }
    ];

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="p-4 flex items-center space-x-2 sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-secondary rounded-full">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <h1 className="text-xl font-black">Compare Pros</h1>
            </div>

            <div className="p-4 overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="p-2 text-left min-w-[100px]"></th>
                            {workers.map(w => (
                                <th key={w.id} className="p-2 min-w-[140px]">
                                    <div className="flex flex-col items-center">
                                        <img src={w.image} alt={w.name} className="w-16 h-16 rounded-full object-cover mb-2 border-2 border-border" />
                                        <span className="font-bold text-sm">{w.name}</span>
                                        <span className="text-[10px] text-muted-foreground">{w.role}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {/* Rating Row */}
                        <tr className="border-t border-border">
                            <td className="p-3 font-bold text-muted-foreground">Rating</td>
                            {workers.map(w => (
                                <td key={w.id} className="p-3 text-center">
                                    <div className="flex items-center justify-center space-x-1 text-yellow-500 font-bold">
                                        <Star className="h-4 w-4 fill-yellow-500" />
                                        <span>{w.rating}</span>
                                    </div>
                                </td>
                            ))}
                        </tr>
                        {/* Rate Row */}
                        <tr className="border-t border-border bg-secondary/20">
                            <td className="p-3 font-bold text-muted-foreground">Rate</td>
                            {workers.map(w => (
                                <td key={w.id} className="p-3 text-center font-bold text-foreground">
                                    {w.rate}
                                </td>
                            ))}
                        </tr>
                        {/* Jobs Row */}
                        <tr className="border-t border-border">
                            <td className="p-3 font-bold text-muted-foreground">Experience</td>
                            {workers.map(w => (
                                <td key={w.id} className="p-3 text-center">
                                    <div className="flex flex-col items-center">
                                        <Briefcase className="h-4 w-4 text-primary mb-1" />
                                        <span className="text-xs">{w.jobs} Jobs</span>
                                    </div>
                                </td>
                            ))}
                        </tr>
                        {/* Response Row */}
                        <tr className="border-t border-border bg-secondary/20">
                            <td className="p-3 font-bold text-muted-foreground">Response</td>
                            {workers.map(w => (
                                <td key={w.id} className="p-3 text-center text-xs font-medium">
                                    {w.response}
                                </td>
                            ))}
                        </tr>
                        {/* Badges Row */}
                        <tr className="border-t border-border">
                            <td className="p-3 font-bold text-muted-foreground align-top pt-4">Badges</td>
                            {workers.map(w => (
                                <td key={w.id} className="p-3 text-center align-top">
                                    <div className="flex flex-wrap justify-center gap-1">
                                        {w.badges.map(b => (
                                            <span key={b} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold">
                                                {b}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                            ))}
                        </tr>
                        {/* Feature Row - Select */}
                        <tr className="border-t border-border">
                            <td className="p-3"></td>
                            {workers.map(w => (
                                <td key={w.id} className="p-3 text-center">
                                    <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-bold text-xs hover:opacity-90 transition-opacity">
                                        Select
                                    </button>
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
