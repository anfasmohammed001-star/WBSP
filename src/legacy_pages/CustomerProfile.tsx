import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Shield, CreditCard, Gift, HelpCircle, LogOut, Medal, Zap, Award, Star } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

export default function CustomerProfile() {
    const navigate = useNavigate();

    const menuItems = [
        { icon: CreditCard, label: 'Payment Methods', sub: 'Visa **42' },
        { icon: Gift, label: 'Refer & Earn', sub: 'Invite friends, get $20' },
        { icon: Shield, label: 'Safety Settings', sub: 'Trusted Contacts' },
        { icon: HelpCircle, label: 'Help & Support', sub: 'FAQs & Chat' },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            {/* Header */}
            <header className="p-4 flex items-center sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-secondary rounded-full transition-colors">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <h1 className="text-lg font-bold ml-2">My Profile</h1>
            </header>

            <div className="p-6">
                {/* Profile Card */}
                <div className="flex items-center space-x-4 mb-8">
                    <div className="relative">
                        <img src="https://i.pravatar.cc/150?u=alexander" alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-background shadow-xl" />
                        <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-background">
                            GOLD
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">Alexander S.</h2>
                        <p className="text-muted-foreground text-sm">+1 (555) 012-3456</p>
                        <div className="flex items-center mt-1 text-xs text-green-500 font-bold">
                            <Star className="h-3 w-3 mr-1 fill-green-500" />
                            4.9 Rating
                        </div>
                    </div>
                </div>

                {/* Gamification / Badges */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg">Achievements</h3>
                        <span className="text-primary text-xs font-bold">See All</span>
                    </div>
                    <div className="bg-secondary/30 p-4 rounded-3xl flex justify-around mb-6">
                        <Badge label="Verified" icon={Shield} color="bg-blue-500" description="Identity Verified" />
                        <Badge label="Power User" icon={Zap} color="bg-yellow-500" description="10+ Jobs Posted" />
                        <Badge label="Early Adopter" icon={Medal} color="bg-purple-500" description="Joined in 2024" />
                        <Badge label="Top Reviewer" icon={Award} color="bg-pink-500" description="5 Helpful Reviews" />
                    </div>

                    {/* Rewards Card */}
                    <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden mb-8 group cursor-pointer hover:shadow-xl transition-shadow" onClick={() => navigate('/rewards')}>
                        <div className="relative z-10">
                            <p className="text-sm font-medium opacity-90">WBSP Rewards Balance</p>
                            <h3 className="text-4xl font-black mt-2">2,450 <span className="text-sm font-bold opacity-70">pts</span></h3>
                            <button className="mt-4 bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold hover:bg-white/30 transition-colors">
                                Redeem for Discounts
                            </button>
                        </div>
                        <Gift className="absolute -bottom-4 -right-4 h-32 w-32 text-white/10 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                </div>

                {/* Wallet / Payment Methods */}
                <div className="mb-8">
                    <h3 className="font-bold text-lg mb-4">Wallet & Payment</h3>
                    <div className="flex space-x-3 overflow-x-auto pb-2 no-scrollbar">
                        <div className="bg-black text-white p-4 rounded-2xl w-40 flex-shrink-0 flex flex-col justify-between h-24 shadow-md">
                            <span className="text-xs font-bold">Apple Pay</span>
                            <span className="text-xs opacity-70">Connected</span>
                        </div>
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white p-4 rounded-2xl w-40 flex-shrink-0 flex flex-col justify-between h-24 shadow-md relative overflow-hidden">
                            <div className="absolute top-0 right-0 h-10 w-10 bg-white/10 rounded-bl-full"></div>
                            <span className="text-xs font-bold">Visa</span>
                            <span className="text-xs font-mono">•••• 4242</span>
                        </div>
                        <button className="border-2 border-dashed border-border rounded-2xl w-24 flex-shrink-0 flex items-center justify-center h-24 hover:bg-secondary/50 transition-colors">
                            <CreditCard className="h-6 w-6 text-muted-foreground" />
                        </button>
                    </div>
                </div>

                {/* Menu List */}
                <div className="space-y-2">
                    {menuItems.map((item, i) => (
                        <button key={i} className="w-full flex items-center p-4 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all group">
                            <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <div className="ml-4 text-left flex-1">
                                <p className="font-bold text-sm">{item.label}</p>
                                <p className="text-xs text-muted-foreground">{item.sub}</p>
                            </div>
                            <ChevronLeft className="h-4 w-4 text-muted-foreground rotate-180" />
                        </button>
                    ))}

                    <button className="w-full flex items-center p-4 rounded-2xl hover:bg-red-500/10 transition-colors group mt-6">
                        <div className="h-10 w-10 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                            <LogOut className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="ml-4 text-left">
                            <p className="font-bold text-sm text-red-500">Log Out</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
