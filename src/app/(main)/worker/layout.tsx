'use client';

import { useEffect } from 'react';

export default function WorkerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Force dark mode for worker section
    useEffect(() => {
        document.documentElement.classList.add('dark');
        return () => {
            // Clean up when leaving worker section if necessary
            // In a real app we might want to toggle this based on route, 
            // but for now this ensures worker stays dark.
            document.documentElement.classList.remove('dark');
        };
    }, []);

    return (
        <div className="dark min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
            {children}
        </div>
    );
}
