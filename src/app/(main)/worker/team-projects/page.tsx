'use client';

import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Users, Briefcase, Plus, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function TeamProjects() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('find');

    const projects = [
        {
            id: 1,
            title: 'Commercial Office Reno',
            role: 'Need Electrician',
            pay: '$45/hr',
            location: 'Downtown',
            crew: 3,
            maxCrew: 5,
            image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=300&q=80'
        },
        {
            id: 2,
            title: 'New Housing Development',
            role: 'Need Framers (2)',
            pay: '$38/hr',
            location: 'Westside',
            crew: 12,
            maxCrew: 20,
            image: 'https://images.unsplash.com/photo-1590644365607-1c5a38d07d99?auto=format&fit=crop&w=300&q=80'
        }
    ];

    const myCrew = [
        { id: 1, name: 'Mike T.', role: 'Foreman', avatar: 'https://i.pravatar.cc/150?u=mike' },
        { id: 2, name: 'Sarah J.', role: 'Plumber', avatar: 'https://i.pravatar.cc/150?u=sarah' },
    ];

    return (
        <div className="bg-background min-h-screen pb-20 text-foreground">
            <header className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-secondary">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-primary" />
                    <h1 className="text-lg font-black">Team Projects</h1>
                </div>
                <div className="w-10"></div>
            </header>

            <div className="p-4 space-y-6">

                {/* Toggle */}
                <div className="flex bg-secondary p-1 rounded-xl">
                    <button
                        onClick={() => setFilter('find')}
                        className={cn("flex-1 py-2 rounded-lg text-sm font-bold transition-all", filter === 'find' ? "bg-background shadow-sm text-primary" : "text-muted-foreground")}
                    >
                        Find Crew
                    </button>
                    <button
                        onClick={() => setFilter('my')}
                        className={cn("flex-1 py-2 rounded-lg text-sm font-bold transition-all", filter === 'my' ? "bg-background shadow-sm text-primary" : "text-muted-foreground")}
                    >
                        My Crew
                    </button>
                </div>

                {filter === 'find' && (
                    <div className="space-y-4">
                        {projects.map(project => (
                            <div key={project.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                                <div className="h-32 w-full relative">
                                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                                    <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-lg text-xs font-bold">
                                        {project.pay}
                                    </div>
                                    <div className="absolute bottom-2 left-2 flex -space-x-2">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="h-6 w-6 rounded-full bg-gray-300 border-2 border-white" />
                                        ))}
                                        <div className="h-6 w-6 rounded-full bg-black/60 text-white border-2 border-white flex items-center justify-center text-[10px] font-bold">
                                            +{project.crew}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-lg mb-1">{project.title}</h3>
                                    <div className="flex items-center justify-between">
                                        <span className="text-primary font-bold text-sm bg-primary/10 px-2 py-1 rounded-md">{project.role}</span>
                                        <span className="text-xs text-muted-foreground">{project.location}</span>
                                    </div>
                                    <button className="w-full mt-4 bg-secondary text-primary font-bold py-2 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                        Apply to Join
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {filter === 'my' && (
                    <div className="space-y-4">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white text-center">
                            <h3 className="font-black text-xl mb-2">Alpha Crew</h3>
                            <p className="text-sm opacity-90 mb-4">Currently working on: <span className="font-bold">City Library HVAC</span></p>
                            <div className="flex justify-center space-x-4">
                                <button className="bg-white/20 p-3 rounded-full hover:bg-white/30 transition-colors">
                                    <MessageSquare className="h-6 w-6" />
                                </button>
                                <button className="bg-white/20 p-3 rounded-full hover:bg-white/30 transition-colors">
                                    <Briefcase className="h-6 w-6" />
                                </button>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-sm text-muted-foreground mb-3 uppercase">Members</h4>
                            <div className="space-y-2">
                                {myCrew.map(member => (
                                    <div key={member.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-2xl">
                                        <div className="flex items-center space-x-3">
                                            <img src={member.avatar} alt={member.name} className="h-10 w-10 rounded-full" />
                                            <div>
                                                <div className="font-bold">{member.name}</div>
                                                <div className="text-xs text-muted-foreground">{member.role}</div>
                                            </div>
                                        </div>
                                        <span className="h-2 w-2 bg-green-500 rounded-full" />
                                    </div>
                                ))}
                                <button className="w-full py-3 border-2 border-dashed border-border rounded-2xl flex items-center justify-center text-muted-foreground font-bold hover:bg-secondary transition-colors">
                                    <Plus className="h-5 w-5 mr-2" />
                                    Invite Member
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
