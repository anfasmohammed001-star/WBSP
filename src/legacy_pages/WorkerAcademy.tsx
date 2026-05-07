import { useNavigate } from 'react-router-dom';
import { ChevronLeft, PlayCircle, BookOpen, Award, CheckCircle2, Lock } from 'lucide-react';
import { cn } from '../lib/utils';

export default function WorkerAcademy() {
    const navigate = useNavigate();

    const modules = [
        {
            id: 1,
            title: 'Customer Service 101',
            duration: '15 mins',
            type: 'Video',
            progress: 100,
            thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=300&q=80',
            locked: false
        },
        {
            id: 2,
            title: 'Advanced Pipe Fitting',
            duration: '45 mins',
            type: 'Course',
            progress: 60,
            thumbnail: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=300&q=80',
            locked: false
        },
        {
            id: 3,
            title: 'Safety Regulations 2024',
            duration: '30 mins',
            type: 'Reading',
            progress: 0,
            thumbnail: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=300&q=80',
            locked: true
        }
    ];

    return (
        <div className="bg-background min-h-screen pb-20 text-foreground">
            {/* Header */}
            <div className="bg-indigo-600 p-6 pb-12 rounded-b-[2.5rem] relative overflow-hidden text-white">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <div className="flex items-center space-x-2 relative z-10 mb-6">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-white/20 transition-colors">
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <h1 className="text-xl font-black">Pro Academy</h1>
                </div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-black mb-2">Keep Learning</h2>
                    <p className="opacity-90 text-sm font-medium">Upskill yourself to earn more and get better ratings.</p>
                </div>
            </div>

            <div className="p-6 -mt-8 space-y-6">
                {/* Stats Row */}
                <div className="bg-card p-4 rounded-2xl shadow-lg border border-border flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center">
                            <Award className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="font-black text-lg">2</div>
                            <div className="text-[10px] uppercase font-bold text-muted-foreground">Certs Earned</div>
                        </div>
                    </div>
                    <div className="h-8 w-[1px] bg-border" />
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
                            <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="font-black text-lg">4h</div>
                            <div className="text-[10px] uppercase font-bold text-muted-foreground">Learning Time</div>
                        </div>
                    </div>
                </div>

                {/* Modules List */}
                <h3 className="text-lg font-black">Recommended For You</h3>
                <div className="space-y-4">
                    {modules.map((module) => (
                        <div key={module.id} className="bg-card rounded-2xl p-3 border border-border shadow-sm flex items-center space-x-4 group hover:border-indigo-500/50 transition-all cursor-pointer">
                            <div className="relative h-20 w-24 rounded-xl overflow-hidden shrink-0">
                                <img src={module.thumbnail} alt={module.title} className="h-full w-full object-cover" />
                                {module.locked && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <Lock className="h-6 w-6 text-white/80" />
                                    </div>
                                )}
                                {!module.locked && (
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <PlayCircle className="h-8 w-8 text-white" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full uppercase tracking-wide">
                                        {module.type}
                                    </span>
                                    {module.progress === 100 && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                                </div>
                                <h4 className="font-bold text-sm truncate pr-2">{module.title}</h4>
                                <p className="text-xs text-muted-foreground mt-0.5">{module.duration}</p>

                                {/* Progress Bar */}
                                {!module.locked && module.progress > 0 && module.progress < 100 && (
                                    <div className="h-1 bg-secondary rounded-full mt-2 w-full">
                                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${module.progress}%` }} />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-gradient-to-r from-orange-400 to-pink-500 rounded-2xl p-5 text-white shadow-lg">
                    <h3 className="font-black text-lg mb-1">Become a Master</h3>
                    <p className="text-xs font-medium opacity-90 mb-3">Complete 5 more courses to unlock the "Master" badge and get priority jobs.</p>
                    <button className="bg-white text-orange-600 px-4 py-2 rounded-xl text-xs font-bold shadow-sm">
                        View Path
                    </button>
                </div>
            </div>
        </div>
    );
}
