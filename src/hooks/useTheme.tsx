import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Routes within the Worker App that should remain LIGHT theme
const WORKER_LIGHT_ROUTES = [
    '/worker/job/',       // Job Tracking / Live Progress
    '/worker/profile/edit', // Edit Profile Form
    '/worker/wallet/history', // Transaction List
    '/worker/jobs/discovery', // Job List View
];

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const pathname = location.pathname;
    const [theme, setTheme] = useState<Theme>('light');

    // Route-Based Theme Logic
    useEffect(() => {
        if (!pathname) return;

        // Default to Light for everything (Customer, Admin, Public)
        let targetTheme: Theme = 'light';

        // Check if we are in the Worker App
        if (pathname.startsWith('/worker')) {
            targetTheme = 'dark'; // Worker default is Dark

            // Check for exceptions (Light Worker Routes)
            const isLightRoute = WORKER_LIGHT_ROUTES.some(route => pathname.includes(route));
            if (isLightRoute) {
                targetTheme = 'light';
            }
        }

        setTheme(targetTheme);
    }, [pathname]);

    // Apply theme class to document element
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
