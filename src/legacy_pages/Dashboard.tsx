import { Plus, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

export default function CustomerDashboard() {
    const navigate = useNavigate();
    // const [isMenuOpen, setIsMenuOpen] = useState(false); // Unused currently

    // Dummy Data
    const user = {
        name: "Alexander Sterling",
        location: "San Francisco, CA",
        avatar: "https://i.pravatar.cc/150?u=alexander",
        totalPosted: 128,
        rating: 4.9,
        pendingJobs: 4
    };

    const activeJobs = [
        {
            id: '1',
            title: 'Full-Stack System Migration',
            status: 'IN PROGRESS',
            dueDate: 'Due in 4 days',
            progress: 65,
            image: 'https://images.unsplash.com/photo-1558441366-4f40445d8b8b?auto=format&fit=crop&w=400&q=80'
        },
        {
            id: '2',
            title: 'Cloud Infrastructure Audit',
            status: 'AUDITING',
            dueDate: 'Started today',
            progress: 25,
            image: 'https://images.unsplash.com/photo-1558494949-0d35069a794c?auto=format&fit=crop&w=400&q=80'
        }
    ];



    return (
        <div className="bg-background min-h-screen pb-24 text-foreground transition-colors duration-300 max-w-md mx-auto shadow-2xl overflow-hidden border-x border-border">
            {/* Rapido Style Header */}
            <div className="p-4 bg-[rgb(10,10,10)] text-white relative overflow-hidden">
                <div className="flex items-center justify-between mb-6 z-10 relative">
                    <div className="flex items-center space-x-2 bg-zinc-900/80 p-2 rounded-full border border-zinc-800">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50">
                            <div className="w-4 h-4 rounded-full border-2 border-green-500"></div>
                        </div>
                        <div className="flex flex-col pr-2">
                            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Current Location</span>
                            <span className="text-xs font-bold text-white leading-none max-w-[150px] truncate">{user.location}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard/profile')}
                        className="w-10 h-10 rounded-full overflow-hidden border-2 border-zinc-700"
                    >
                        <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                    </button>
                </div>

                {/* Favorites - Personalization */}
                <div className="mb-6">
                    <div className="flex justify-between items-end mb-3">
                        <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Your Favorites</h2>
                        <button className="text-[10px] text-blue-400 font-bold">Edit</button>
                    </div>
                    <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-2">
                        {[
                            { name: 'Home Clean', icon: '🧹', color: 'bg-indigo-600' },
                            { name: 'Plumber', icon: '🔧', color: 'bg-blue-600' },
                        ].map((fav, i) => (
                            <motion.button
                                key={i}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center space-x-3 bg-zinc-800/50 border border-zinc-700 p-2 pr-4 rounded-xl flex-shrink-0"
                            >
                                <div className={`w-8 h-8 rounded-lg ${fav.color} flex items-center justify-center text-sm shadow-md`}>
                                    {fav.icon}
                                </div>
                                <span className="text-xs font-bold text-zinc-200">{fav.name}</span>
                            </motion.button>
                        ))}
                        <button className="flex items-center space-x-3 bg-zinc-800/30 border border-dashed border-zinc-700 p-2 pr-4 rounded-xl flex-shrink-0 hover:bg-zinc-800 transition-colors">
                            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-sm">
                                <Plus className="w-4 h-4 text-zinc-500" />
                            </div>
                            <span className="text-xs font-bold text-zinc-500">Add New</span>
                        </button>
                    </div>
                </div>

                <h1 className="text-2xl font-black text-white mb-6">All Services</h1>

                {/* Services Grid - Mobile Optimized */}
                <div className="grid grid-cols-4 gap-3">
                    {[
                        { name: 'Plumber', icon: '🔧', color: 'bg-blue-600' },
                        { name: 'Electrician', icon: '⚡', color: 'bg-yellow-500' },
                        { name: 'Cleaner', icon: '🧹', color: 'bg-purple-600' },
                        { name: 'Painter', icon: '🎨', color: 'bg-pink-500' },
                        { name: 'Carpenter', icon: '🪚', color: 'bg-orange-600' },
                        { name: 'Garden', icon: '🌿', color: 'bg-green-600' },
                        { name: 'Tech', icon: '💻', color: 'bg-indigo-600' },
                        { name: 'More', icon: '➕', color: 'bg-zinc-700' },
                    ].map((service) => (
                        <motion.button
                            key={service.name}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                if (service.name === 'More') navigate('/jobs');
                                else navigate('/post-job', { state: { category: service.name.toUpperCase() } });
                            }}
                            className="flex flex-col items-center p-3 rounded-2xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors space-y-2"
                        >
                            <div className={cn("w-12 h-10 rounded-xl flex items-center justify-center text-xl shadow-lg", service.color)}>
                                {service.icon}
                            </div>
                            <span className="text-[10px] font-bold text-zinc-300">{service.name}</span>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Stats Card */}
            <div className="px-6 mb-8">
                <div className="bg-card rounded-3xl p-6 shadow-premium border border-border flex divide-x divide-border">
                    <div className="flex-1 space-y-2">
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Posted</div>
                        <div className="text-4xl font-extrabold text-foreground">{user.totalPosted}</div>
                        <div className="text-[10px] font-bold text-green-500 flex items-center">
                            <span className="mr-1">📈</span> +12%
                        </div>
                    </div>
                    <div className="flex-1 pl-6 space-y-2">
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Pending Jobs</div>
                        <div className="flex items-baseline space-x-1">
                            <span className="text-4xl font-extrabold text-foreground">{user.pendingJobs}</span>
                        </div>
                        <div className="text-[10px] font-bold text-orange-500">
                            Action Required
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Jobs Section */}
            <div className="mb-8">
                <div className="flex justify-between items-center px-6 mb-4">
                    <h3 className="text-xl font-extrabold text-foreground">Current Active Jobs</h3>
                    <div className="flex items-center space-x-3">
                        <Button variant="premium" size="sm" className="rounded-xl px-4 h-9 font-bold text-xs space-x-1" onClick={() => navigate('/post-job')}>
                            <Plus className="h-3.5 w-3.5" />
                            <span>New Job</span>
                        </Button>
                    </div>
                </div>
                <div className="flex overflow-x-auto space-x-4 px-6 pb-4 no-scrollbar">
                    {activeJobs.map((job) => (
                        <motion.div
                            key={job.id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate(`/tracking/${job.id}`)}
                            className="flex-shrink-0 w-[240px] bg-card rounded-3xl p-4 shadow-sm border border-border space-y-4 hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <div className="relative rounded-2xl overflow-hidden h-36 w-full">
                                <img src={job.image} alt={job.title} loading="lazy" className="w-full h-full object-cover" />
                                <div className="absolute top-3 left-3">
                                    <span className="bg-card/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[9px] font-bold tracking-tight text-primary shadow-sm border border-border/50">
                                        {job.status}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h4 className="font-bold text-foreground leading-snug line-clamp-2 h-10">{job.title}</h4>
                                <div className="flex items-center text-muted-foreground text-[10px] font-medium">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {job.dueDate}
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-bold">
                                        <span className="text-muted-foreground uppercase tracking-wider">Progress</span>
                                        <span className="text-primary">{job.progress}%</span>
                                    </div>
                                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${job.progress}%` }}
                                            className="h-full bg-primary"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>


        </div>
    );
}
