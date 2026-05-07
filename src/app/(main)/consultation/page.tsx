import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Video, Star, Clock } from 'lucide-react';

export default function VirtualConsultation() {
    const navigate = useNavigate();

    const experts = [
        { id: 1, name: 'David Kim', role: 'Home Inspector', rating: 4.9, image: 'https://i.pravatar.cc/150?u=david', price: '$25' },
        { id: 2, name: 'Sarah Lee', role: 'Interior Designer', rating: 5.0, image: 'https://i.pravatar.cc/150?u=sarahlee', price: '$40' },
        { id: 3, name: 'Mike Ross', role: 'Master Plumber', rating: 4.8, image: 'https://i.pravatar.cc/150?u=mikeross', price: '$30' },
    ];

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="p-4 flex items-center space-x-2 sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-secondary rounded-full">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <h1 className="text-xl font-black">Virtual Expert</h1>
            </div>

            <div className="p-4 space-y-6">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg">
                    <h2 className="text-2xl font-black mb-2">Video Consults</h2>
                    <p className="opacity-90 text-sm mb-4">Not sure what's wrong? Show an expert via video call before booking.</p>
                    <button className="bg-white text-indigo-600 px-4 py-2 rounded-xl text-xs font-bold shadow-md">
                        How it works
                    </button>
                </div>

                <h3 className="font-bold text-lg">Available Experts</h3>
                <div className="space-y-4">
                    {experts.map((expert) => (
                        <div key={expert.id} className="bg-card border border-border rounded-2xl p-4 flex items-center space-x-4 shadow-sm">
                            <img src={expert.image} alt={expert.name} className="h-16 w-16 rounded-xl object-cover" />
                            <div className="flex-1">
                                <h4 className="font-bold text-foreground">{expert.name}</h4>
                                <p className="text-xs text-muted-foreground font-bold">{expert.role}</p>
                                <div className="flex items-center text-xs text-yellow-500 font-bold mt-1">
                                    <Star className="h-3 w-3 fill-yellow-500 mr-1" />
                                    {expert.rating}
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block font-black text-lg">{expert.price}</span>
                                <span className="text-[10px] text-muted-foreground font-bold">/ 15 min</span>
                                <button className="mt-2 bg-primary text-primary-foreground p-2 rounded-xl hover:opacity-90 transition-opacity">
                                    <Video className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
