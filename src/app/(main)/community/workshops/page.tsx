import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, Video, Users, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export default function LiveWorkshops() {
    const navigate = useNavigate();

    const workshops = [
        {
            id: 1,
            title: 'Advanced Electrical Diagnostics',
            host: 'Mike Holmes',
            date: new Date(Date.now() + 86400000 * 2), // 2 days from now
            attendees: 124,
            image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=300&q=80',
            live: false
        },
        {
            id: 2,
            title: 'Customer Service Masterclass',
            host: 'Sarah Lee',
            date: new Date(),
            attendees: 56,
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=300&q=80',
            live: true
        }
    ];

    return (
        <div className="bg-background min-h-screen pb-20 text-foreground">
            <header className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-secondary">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-2">
                    <Video className="h-5 w-5 text-red-500" />
                    <h1 className="text-lg font-black">Live Workshops</h1>
                </div>
                <div className="w-10"></div>
            </header>

            <div className="p-4 space-y-6">
                {/* Featured Event */}
                {workshops.filter(w => w.live).map(event => (
                    <div key={event.id} className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] group cursor-pointer">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                        <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-black animate-pulse flex items-center">
                            <div className="h-2 w-2 bg-white rounded-full mr-2" />
                            LIVE NOW
                        </div>
                        <div className="absolute bottom-0 inset-x-0 p-6">
                            <h2 className="text-white font-black text-2xl leading-tight mb-2">{event.title}</h2>
                            <div className="flex items-center text-white/80 text-sm font-medium mb-4">
                                <span>with {event.host}</span>
                                <span className="mx-2">•</span>
                                <Users className="h-4 w-4 mr-1" /> {event.attendees} watching
                            </div>
                            <button className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-white/90 transition-colors">
                                Join Stream
                            </button>
                        </div>
                    </div>
                ))}

                {/* Upcoming List */}
                <div>
                    <h3 className="font-bold text-lg mb-4 flex items-center">
                        <Calendar className="h-5 w-5 mr-2" />
                        Upcoming
                    </h3>
                    <div className="space-y-4">
                        {workshops.filter(w => !w.live).map(event => (
                            <div key={event.id} className="bg-card border border-border p-3 rounded-2xl flex items-center space-x-4 shadow-sm hover:bg-secondary/50 transition-colors cursor-pointer">
                                <div className="h-20 w-20 rounded-xl overflow-hidden shrink-0">
                                    <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-bold text-primary mb-1">
                                        {format(event.date, 'MMM d, h:mm a')}
                                    </div>
                                    <h4 className="font-bold text-sm truncate pr-2">{event.title}</h4>
                                    <p className="text-xs text-muted-foreground mt-1">By {event.host}</p>
                                </div>
                                <button className="p-2 bg-secondary rounded-full">
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
