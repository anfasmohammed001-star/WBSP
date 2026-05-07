import { useEffect, useRef } from 'react';
import { jobService } from '../services/jobService';

interface WorkerLocationTrackerProps {
    jobId: string;
    isJobActive: boolean;
}

const WorkerLocationTracker = ({ jobId, isJobActive }: WorkerLocationTrackerProps) => {
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Stop tracking if job is not active
        if (!isJobActive) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }

        const sendLocation = () => {
            if (!navigator.geolocation) return;

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    // Send to DB (fire and forget)
                    jobService.updateWorkerLocation(jobId, latitude, longitude);
                },
                (err) => console.error('GPS Error:', err),
                { enableHighAccuracy: true } // Important for precision
            );
        };

        // Send immediately on mount, then every 10 seconds
        sendLocation();
        intervalRef.current = setInterval(sendLocation, 10000);

        // Cleanup on unmount
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [jobId, isJobActive]);

    return null; // This component renders nothing visible
};

export default WorkerLocationTracker;
