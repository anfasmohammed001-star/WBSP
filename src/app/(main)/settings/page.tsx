'use client';

import { Bell, Lock, User, Globe, Moon, ChevronRight, X, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsItemProps {
    icon: any;
    label: string;
    value?: string;
    onClick?: () => void;
    showChevron?: boolean;
}

const SettingsItem = ({ icon: Icon, label, value, onClick, showChevron = true }: SettingsItemProps) => (
    <div
        onClick={onClick}
        className={cn(
            "flex items-center justify-between p-4 bg-card hover:bg-secondary/50 transition-colors cursor-pointer",
            "border-b border-border last:border-0"
        )}
    >
        <div className="flex items-center gap-4">
            <div className="p-2.5 bg-secondary/50 rounded-xl text-foreground">
                <Icon className="h-5 w-5" />
            </div>
            <span className="font-medium text-foreground">{label}</span>
        </div>
        <div className="flex items-center gap-2">
            {value && <span className="text-sm font-medium text-muted-foreground">{value}</span>}
            {showChevron && <ChevronRight className="h-4 w-4 text-muted-foreground/50" />}
        </div>
    </div>
);

export default function Settings() {
    const { logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    // State for local settings features
    const [notifications, setNotifications] = useState(true);
    const [language, setLanguage] = useState('English');
    const [showSecurityModal, setShowSecurityModal] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        toast.success("Logged out successfully");
    };

    const toggleNotifications = () => {
        setNotifications(!notifications);
        toast.success(`Notifications turned ${!notifications ? 'On' : 'Off'}`, {
            icon: !notifications ? '🔔' : '🔕'
        });
    };

    const cycleLanguage = () => {
        const languages = ['English', 'Spanish', 'French', 'German'];
        const currentIndex = languages.indexOf(language);
        const nextIndex = (currentIndex + 1) % languages.length;
        setLanguage(languages[nextIndex]);
        toast.success(`Language changed to ${languages[nextIndex]}`, { icon: '🌐' });
    };

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300 max-w-md mx-auto shadow-2xl overflow-hidden border-x border-border">
            {/* Header */}
            <div className="p-4 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="hover:bg-secondary p-2 rounded-full transition-colors md:hidden">
                        <ChevronRight className="h-6 w-6 rotate-180" />
                    </button>
                    <h1 className="text-xl font-bold">Settings</h1>
                </div>
            </div>

            <div className="p-4 space-y-6 max-w-2xl mx-auto py-8">
                {/* Group 1 */}
                <div className="rounded-2xl border border-border overflow-hidden bg-card shadow-sm">
                    <SettingsItem
                        icon={User}
                        label="Account Information"
                        onClick={() => navigate('/profile')}
                    />
                    <SettingsItem
                        icon={Lock}
                        label="Security & Privacy"
                        onClick={() => setShowSecurityModal(true)}
                    />
                    <SettingsItem
                        icon={Bell}
                        label="Notifications"
                        value={notifications ? "On" : "Off"}
                        onClick={toggleNotifications}
                    />
                </div>

                {/* Group 2 */}
                <div className="rounded-2xl border border-border overflow-hidden bg-card shadow-sm">
                    <SettingsItem
                        icon={Globe}
                        label="Language"
                        value={language}
                        onClick={cycleLanguage}
                    />
                    <SettingsItem
                        icon={Moon}
                        label="Dark Mode"
                        value={theme === 'dark' ? 'On' : 'Off'}
                        onClick={() => {
                            toggleTheme();
                            toast.success(`Dark mode ${theme === 'dark' ? 'disabled' : 'enabled'}`);
                        }}
                    />
                </div>

                <Button
                    variant="destructive"
                    className="w-full h-12 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all mt-8"
                    onClick={handleLogout}
                >
                    Log Out
                </Button>
            </div>

            {/* Security Modal */}
            <AnimatePresence>
                {showSecurityModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-card w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden border border-border"
                        >
                            <div className="p-6 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-500/10 rounded-xl">
                                            <Shield className="h-6 w-6 text-green-500" />
                                        </div>
                                        <h2 className="text-lg font-bold">Security & Privacy</h2>
                                    </div>
                                    <button
                                        onClick={() => setShowSecurityModal(false)}
                                        className="p-2 hover:bg-secondary rounded-full transition-colors"
                                    >
                                        <X className="h-5 w-5 text-muted-foreground" />
                                    </button>
                                </div>

                                <div className="space-y-4 text-sm text-muted-foreground">
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-foreground">Data Protection</h3>
                                        <p>Your personal data is encrypted and stored securely. We adhere to strict data protection regulations to ensure your privacy.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-foreground">Account Security</h3>
                                        <p>Two-factor authentication is recommended. Please ensure your password is strong and unique.</p>
                                    </div>
                                    <div className="p-4 bg-secondary/50 rounded-xl text-center">
                                        <p className="font-medium text-foreground">Last Security Check: Today</p>
                                        <p className="text-xs mt-1">Status: Secure</p>
                                    </div>
                                </div>

                                <Button
                                    className="w-full rounded-xl"
                                    onClick={() => setShowSecurityModal(false)}
                                >
                                    Done
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
