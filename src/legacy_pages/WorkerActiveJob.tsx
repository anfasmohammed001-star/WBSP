import { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { jobService } from '../services/jobService';
import WorkerLocationTracker from '../components/WorkerLocationTracker';
import { Button } from '../components/ui/Button';
import { ChevronRight, ShieldCheck, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function WorkerActiveJob() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    // Security Check
    if (user?.userType !== 'worker') {
        return <Navigate to="/dashboard" replace />;
    }
    // In a real app, you'd fetch the job details from ID in URL or state
    // For now, we assume job structure is passed or we'd fetch it.
    // Let's use a mock or passed state for simplicity of this verification.
    const currentJob = location.state?.job || {
        id: 'mock-job-id',
        title: 'Emergency Plumbing Repair',
        status: 'assigned'
    };

    const [status, setStatus] = useState<'assigned' | 'in_progress' | 'completed'>(currentJob.status);
    const [otpInput, setOtpInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleStartJob = async () => {
        if (otpInput.length !== 4) {
            toast.error("Please enter a valid 4-digit PIN");
            return;
        }

        setIsLoading(true);
        try {
            const isVerified = await jobService.verifyJobStart(currentJob.id, otpInput);
            if (isVerified) {
                setStatus('in_progress');
                toast.success("Success! Job Timer Started.");
            } else {
                toast.error("Incorrect PIN. Ask customer to check their app.");
            }
        } catch (error) {
            console.error(error);
            toast.error("System error verifying PIN");
        }
        setIsLoading(false);
    };

    const handleFinishJob = async () => {
        if (!window.confirm("Are you sure this job is completed?")) return;

        try {
            await jobService.completeJob(currentJob.id);
            setStatus('completed');
            toast.success("Job Done! Invoice Generated.");
            navigate('/dashboard/worker'); // Return to dashboard
        } catch (error) {
            console.error(error);
            toast.error("Error completing job");
        }
    };

    return (
        <div className="min-h-screen bg-background p-6 flex flex-col items-center">
            {/* Header */}
            <div className="w-full flex justify-between items-center mb-8">
                <h1 className="text-xl font-bold">Active Job</h1>
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                    {status.replace('_', ' ')}
                </div>
            </div>

            {/* Job Card */}
            <div className="w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-xl mb-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-bold text-foreground">{currentJob.title}</h2>
                        <div className="flex items-center text-muted-foreground text-sm mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>123 Main St, New York</span>
                        </div>
                    </div>
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                    </div>
                </div>
            </div>

            {/* Action Area */}
            <div className="w-full max-w-md flex-1 flex flex-col justify-center">
                {status === 'assigned' && (
                    <div className="bg-card border border-border rounded-3xl p-8 shadow-2xl text-center space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-foreground">Worker Verification</h3>
                            <p className="text-muted-foreground text-sm">
                                Arrived at the location? Ask the customer for the secure start PIN.
                            </p>
                        </div>

                        <input
                            type="text"
                            placeholder="0 0 0 0"
                            maxLength={4}
                            value={otpInput}
                            onChange={(e) => setOtpInput(e.target.value)}
                            className="w-full text-center text-5xl font-mono font-bold tracking-[0.5em] bg-secondary border-2 border-border rounded-2xl py-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                        />

                        <Button
                            variant="premium"
                            size="lg"
                            className="w-full"
                            onClick={handleStartJob}
                            isLoading={isLoading}
                        >
                            Verify & Start Job <ChevronRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                )}

                {status === 'in_progress' && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-3xl p-8 text-center space-y-8">
                        <div className="space-y-4">
                            <div className="relative h-24 w-24 mx-auto">
                                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
                                <div className="relative h-full w-full bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                                    <ShieldCheck className="h-10 w-10 text-white" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-green-600 dark:text-green-400">Job In Progress</h3>
                                <p className="text-green-600/70 dark:text-green-400/70 text-sm font-medium">
                                    Live tracking is enabled.
                                </p>
                            </div>
                        </div>

                        <Button
                            variant="destructive"
                            size="lg"
                            className="w-full h-16 text-lg"
                            onClick={handleFinishJob}
                        >
                            Complete Job
                        </Button>

                        {/* Background Tracker */}
                        <WorkerLocationTracker jobId={currentJob.id} isJobActive={true} />
                    </div>
                )}
            </div>
        </div>
    );
}
