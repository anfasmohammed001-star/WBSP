

import { cn } from '@/lib/utils';

export const LoadingSpinner = ({ className }: { className?: string }) => {
    return (
        <div className={cn("flex items-center justify-center min-h-[50vh] w-full", className)}>
            <div className="relative h-16 w-16">
                <div className="absolute inset-0 rounded-full border-4 border-secondary border-t-primary animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-4 border-secondary border-t-transparent animate-spin-reverse opacity-50"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="h-2 w-2 bg-primary rounded-full animate-pulse"></span>
                </div>
            </div>
        </div>
    );
};

export default LoadingSpinner; // Default export for lazy loading compatibility if needed
