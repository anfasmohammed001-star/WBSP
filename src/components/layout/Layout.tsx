import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Bell } from 'lucide-react';
import BottomNavigation from './BottomNavigation';
import HamburgerMenu from './HamburgerMenu';
import { useState } from 'react';
import toast from 'react-hot-toast';
import GeminiAssistant from '../ai/GeminiAssistant';
import { FeedbackWidget } from '../ui/FeedbackWidget';

export default function Layout() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const location = useLocation();
    const isDashboard = location?.pathname?.startsWith('/dashboard');

    return (
        <div className="min-h-screen flex flex-col transition-colors duration-300 bg-background text-foreground">
            {/* Top Header - Hidden on Dashboards to avoid redundancy */}
            {!isDashboard && (
                <header className="sticky top-0 z-30 px-4 h-16 flex items-center justify-between backdrop-blur-md border-b bg-background/80 border-border">
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="p-2.5 rounded-2xl transition-colors bg-secondary/50 hover:bg-secondary text-secondary-foreground"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <span className="font-black text-xl tracking-[0.1em] uppercase text-primary">
                            WBSP
                        </span>
                    </div>
                    <button
                        onClick={() => navigate('/notifications-legacy')}
                        className="p-2.5 rounded-2xl transition-colors relative bg-secondary/50 text-secondary-foreground hover:bg-secondary"
                    >
                        <Bell className="h-5 w-5" />
                        <div className="absolute top-2.5 right-2.5 h-2 w-2 bg-primary rounded-full ring-2 ring-background" />
                    </button>
                </header>
            )}

            {/* Main Content Area */}
            <main className="flex-1 pb-24 no-scrollbar relative">
                <Outlet />
                <GeminiAssistant />
                <FeedbackWidget />
            </main>

            {/* Navigation Components */}
            <BottomNavigation />
            <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </div>
    );
}
