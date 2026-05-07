'use client';

import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Users, Search, Phone, Mail, Star, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function ClientManager() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');

    const clients = [
        { id: 1, name: 'John Doe', jobs: 3, spent: '$450', lastJob: 'Jan 10', rating: 5, avatar: 'https://i.pravatar.cc/150?u=john' },
        { id: 2, name: 'Sarah Smith', jobs: 1, spent: '$120', lastJob: 'Dec 15', rating: 4, avatar: 'https://i.pravatar.cc/150?u=sarah' },
        { id: 3, name: 'Mike Johnson', jobs: 5, spent: '$980', lastJob: 'Jan 15', rating: 5, avatar: 'https://i.pravatar.cc/150?u=mike' },
    ];

    return (
        <div className="bg-background min-h-screen pb-20 text-foreground">
            <header className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-secondary">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-primary" />
                    <h1 className="text-lg font-black">Clients</h1>
                </div>
                <div className="w-10"></div>
            </header>

            <div className="p-4 space-y-4">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search clients..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-secondary border-none rounded-2xl h-12 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>

                {/* Client List */}
                <div className="space-y-4">
                    {clients.map(client => (
                        <div key={client.id} className="bg-card border border-border rounded-2xl p-4 shadow-sm hover:border-primary/50 transition-colors cursor-pointer group">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center space-x-3">
                                    <img src={client.avatar} alt={client.name} className="h-12 w-12 rounded-xl" />
                                    <div>
                                        <h3 className="font-bold text-base">{client.name}</h3>
                                        <div className="text-xs text-muted-foreground font-medium flex items-center">
                                            <Calendar className="h-3 w-3 mr-1" /> Last: {client.lastJob}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-black text-green-600">{client.spent}</div>
                                    <div className="text-[10px] font-bold text-muted-foreground">{client.jobs} Jobs</div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-border mt-3">
                                <div className="flex space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={cn("h-3 w-3", i < client.rating ? "text-yellow-400 fill-yellow-400" : "text-input")} />
                                    ))}
                                </div>
                                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 bg-secondary rounded-full hover:bg-primary hover:text-white transition-colors">
                                        <Phone className="h-4 w-4" />
                                    </button>
                                    <button className="p-2 bg-secondary rounded-full hover:bg-primary hover:text-white transition-colors">
                                        <Mail className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
