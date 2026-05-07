import { useNavigate } from 'react-router-dom';
import { ChevronLeft, BookOpen, PenTool, BatteryCharging, Droplets } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ServiceGuide() {
    const navigate = useNavigate();

    const guides = [
        {
            title: 'Prepare for Plumbers',
            icon: Droplets,
            color: 'bg-blue-500',
            steps: ['Clear the area under the sink', 'Turn off main water valve if leaking', 'Have towels ready']
        },
        {
            title: 'Electric Safety 101',
            icon: BatteryCharging,
            color: 'bg-yellow-500',
            steps: ['Never touch exposed wires', 'Check breaker box first', 'Unplug sensitive electronics']
        },
        {
            title: 'DIY Minor Repairs',
            icon: PenTool,
            color: 'bg-orange-500',
            steps: ['Tightening loose hinges', 'Unclogging drains with baking soda', 'Patching small wall holes']
        }
    ];

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="p-4 flex items-center space-x-2 sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-secondary rounded-full">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <h1 className="text-xl font-black">Helpful Guides</h1>
            </div>

            <div className="p-4 space-y-6">
                <div className="bg-primary/10 rounded-3xl p-6 text-primary mb-8">
                    <BookOpen className="h-10 w-10 mb-4" />
                    <h2 className="text-2xl font-black mb-2">Learn & Prepare</h2>
                    <p className="font-medium opacity-80">Make the most of your service visits with these quick guides.</p>
                </div>

                <div className="grid gap-6">
                    {guides.map((guide, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5 }}
                            className="bg-card border border-border rounded-3xl p-6 shadow-sm overflow-hidden relative"
                        >
                            <div className={`absolute top-0 right-0 p-4 rounded-bl-3xl ${guide.color} bg-opacity-20`}>
                                <guide.icon className={`h-8 w-8 ${guide.color.replace('bg-', 'text-')}`} />
                            </div>

                            <h3 className="text-lg font-bold mb-4 pr-12">{guide.title}</h3>
                            <ul className="space-y-3">
                                {guide.steps.map((step, idx) => (
                                    <li key={idx} className="flex items-start text-sm text-muted-foreground">
                                        <span className={`h-5 w-5 rounded-full ${guide.color} text-white flex items-center justify-center text-[10px] font-bold mr-3 flex-shrink-0`}>
                                            {idx + 1}
                                        </span>
                                        {step}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
