import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ChevronLeft, ChevronRight, Upload, Calendar, Zap, CheckCircle2, Mic, X, Play, Pause, Trash2, MapPin, Clock } from 'lucide-react';
import { CategorySelector } from '../components/jobs/CategorySelector';
import { cn } from '../lib/utils';
import { useAuth } from '../hooks/useAuth';
import { jobService } from '../services/jobService';

export default function PostJob() {
    const navigate = useNavigate();
    const location = useLocation();
    const initialCategory = location.state?.category || '';

    // If category is passed, start at Step 2 (Details)
    const [step, setStep] = useState(initialCategory ? 2 : 1);
    const [formData, setFormData] = useState({
        category: initialCategory,
        title: '',
        description: '',
        address: '',
        budget: '',
        date: '',
        time: '',
        urgency: 'Medium',
        jobType: 'scheduled',
        images: [] as string[],
        files: [] as File[],
        audioNote: null as Blob | null
    });

    // Voice Recording State
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // File Upload Ref
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Location State
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

    const handleGetCurrentLocation = () => {
        setIsLoadingLocation(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    // In a real app, we'd reverse geocode here. For now, we'll set a string.
                    const locationString = `Pinned Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
                    setFormData(prev => ({ ...prev, address: locationString }));
                    setIsLoadingLocation(false);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Could not access location. Please check permissions.");
                    setIsLoadingLocation(false);
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
            setIsLoadingLocation(false);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            const chunks: BlobPart[] = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                setFormData(prev => ({ ...prev, audioNote: blob }));
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            mediaRecorderRef.current = mediaRecorder;
            setIsRecording(true);

            // Start Timer
            setRecordingTime(0);
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone. Please check permissions.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    const deleteRecording = () => {
        setFormData(prev => ({ ...prev, audioNote: null }));
        setRecordingTime(0);
        setIsPlaying(false);
    };

    const togglePlayAudio = () => {
        if (!formData.audioNote) return;

        if (isPlaying) {
            audioRef.current?.pause();
            setIsPlaying(false);
        } else {
            if (!audioRef.current) {
                audioRef.current = new Audio(URL.createObjectURL(formData.audioNote));
                audioRef.current.onended = () => setIsPlaying(false);
            }
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFormData(prev => ({ ...prev, files: [...prev.files, ...newFiles] }));
        }
    };

    const removeFile = (index: number) => {
        setFormData(prev => ({
            ...prev,
            files: prev.files.filter((_, i) => i !== index)
        }));
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleNext = () => {
        setStep(prev => prev + 1);
    };

    const handleBack = () => {
        setStep(prev => prev - 1);
    };

    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            alert("You must be logged in to post a job.");
            return;
        }

        setIsSubmitting(true);
        try {
            await jobService.createJob(user.id, {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                job_type: formData.jobType as 'scheduled' | 'spot',
                budget: parseFloat(formData.budget) || 0,
                urgency_level: formData.urgency,
                location_address: formData.address,
                date: formData.date,
                time: formData.time
            });

            // Navigate to dashboard on success
            navigate('/dashboard');
        } catch (error) {
            console.error("Error posting job:", error);
            alert("Failed to post job. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col text-foreground">
            {/* Header */}
            <div className="bg-card border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={step > 1 ? handleBack : () => navigate(-1)}
                        className="mr-2"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <h1 className="font-bold text-lg text-foreground">Post a Job</h1>
                </div>
                <span className="text-sm text-muted-foreground">Step {step} of 4</span>
            </div>

            <div className="flex-1 p-4 max-w-lg mx-auto w-full">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Step 1: Category */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-foreground">What kind of work do you need?</h2>
                            <CategorySelector
                                selectedCategory={formData.category}
                                onSelect={(cat: string) => setFormData({ ...formData, category: cat })}
                            />
                        </div>
                    )}

                    {/* Step 2: Details */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-foreground">Describe the details</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-muted-foreground">Job Title</label>
                                    <Input
                                        placeholder="e.g. Broken Pipe in Kitchen"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="bg-background border-input text-foreground"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-muted-foreground">Description</label>
                                    <div className="relative">
                                        <textarea
                                            className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-foreground pb-12"
                                            placeholder="Describe the issue in detail..."
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        />

                                        {/* Voice Note Interface */}
                                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                                            {!formData.audioNote ? (
                                                !isRecording ? (
                                                    <button
                                                        type="button"
                                                        onClick={startRecording}
                                                        className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors bg-primary/10 px-3 py-1.5 rounded-full text-xs font-bold"
                                                    >
                                                        <Mic className="h-3.5 w-3.5" />
                                                        <span>Record Voice Note</span>
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center space-x-3 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-full animate-pulse">
                                                        <div className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                                                        <span className="text-xs font-mono font-bold text-red-600 dark:text-red-400">{formatTime(recordingTime)}</span>
                                                        <button type="button" onClick={stopRecording} className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                                                            <div className="h-2 w-2 bg-white rounded-[1px]" />
                                                        </button>
                                                    </div>
                                                )
                                            ) : (
                                                <div className="flex items-center space-x-2 bg-primary/10 px-3 py-1.5 rounded-full w-full max-w-[200px]">
                                                    <button type="button" onClick={togglePlayAudio} className="text-primary hover:text-primary/80">
                                                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                                    </button>
                                                    <div className="flex-1 h-1 bg-primary/30 rounded-full overflow-hidden">
                                                        <div className="h-full bg-primary w-1/2 animate-pulse" />
                                                    </div>
                                                    <button type="button" onClick={deleteRecording} className="text-muted-foreground hover:text-red-500">
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1 text-muted-foreground">Add Photos/Video</label>

                                    <div className="grid grid-cols-4 gap-2 mb-3">
                                        {formData.files.map((file, idx) => (
                                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
                                                {file.type.startsWith('image/') ? (
                                                    <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-secondary flex items-center justify-center">
                                                        <span className="text-xs font-bold text-muted-foreground">VIDEO</span>
                                                    </div>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(idx)}
                                                    className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-muted-foreground bg-card hover:bg-secondary/50 transition-colors cursor-pointer"
                                    >
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*,video/*"
                                            className="hidden"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                        />
                                        <Upload className="h-8 w-8 mb-2" />
                                        <span className="text-sm">Tap to upload</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Location (Simplified) */}
                    {/* Step 3: Location */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-foreground">Where is the work?</h2>

                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-muted-foreground">Address</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            placeholder="Enter Address"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="bg-background border-input text-foreground pl-10"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full h-12 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary gap-2"
                                    onClick={handleGetCurrentLocation}
                                    disabled={isLoadingLocation}
                                >
                                    {isLoadingLocation ? (
                                        <span className="flex items-center gap-2">
                                            <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                            Locating...
                                        </span>
                                    ) : (
                                        <>
                                            <MapPin className="h-4 w-4" />
                                            Pin Current Location
                                        </>
                                    )}
                                </Button>
                            </div>

                            <div className="h-48 bg-secondary rounded-xl flex flex-col items-center justify-center text-muted-foreground border border-border mt-4 overflow-hidden relative group">
                                {formData.address.includes('Pinned Location') ? (
                                    <div className="relative w-full h-full bg-blue-500/10 flex flex-col items-center justify-center gap-2">
                                        <div className="h-12 w-12 bg-blue-500/20 text-blue-600 rounded-full flex items-center justify-center">
                                            <MapPin className="h-6 w-6 fill-blue-600" />
                                        </div>
                                        <span className="text-sm font-bold text-blue-600">Location Pinned Successfully</span>
                                        <span className="text-xs text-muted-foreground">Map preview unavailable in development</span>
                                    </div>
                                ) : (
                                    <>
                                        <MapPin className="h-8 w-8 mb-2 opacity-50" />
                                        <span className="text-sm">Map Preview</span>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 4: Budget & Schedule */}
                    {step === 4 && (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-foreground">When do you need help?</h2>

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, jobType: 'scheduled' })}
                                        className={cn(
                                            "relative p-6 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center text-center space-y-3",
                                            formData.jobType === 'scheduled'
                                                ? "border-blue-500 bg-blue-500/5 ring-1 ring-blue-500"
                                                : "border-border bg-card hover:border-blue-200"
                                        )}
                                    >
                                        {formData.jobType === 'scheduled' && (
                                            <div className="absolute top-3 right-3">
                                                <div className="bg-blue-500 rounded-full p-0.5">
                                                    <CheckCircle2 className="h-3 w-3 text-white" />
                                                </div>
                                            </div>
                                        )}
                                        <Calendar className={cn("h-8 w-8", formData.jobType === 'scheduled' ? "text-blue-500" : "text-muted-foreground")} />
                                        <div>
                                            <div className={cn("font-bold text-base", formData.jobType === 'scheduled' ? "text-blue-600" : "text-foreground")}>Scheduled</div>
                                            <div className="text-xs font-medium text-muted-foreground mt-1">Pick a future date</div>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, jobType: 'spot' })}
                                        className={cn(
                                            "relative p-6 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center text-center space-y-3",
                                            formData.jobType === 'spot'
                                                ? "border-blue-500 bg-blue-500/5 ring-1 ring-blue-500"
                                                : "border-border bg-card hover:border-blue-200"
                                        )}
                                    >
                                        {formData.jobType === 'spot' && (
                                            <div className="absolute top-3 right-3">
                                                <div className="bg-blue-500 rounded-full p-0.5">
                                                    <CheckCircle2 className="h-3 w-3 text-white" />
                                                </div>
                                            </div>
                                        )}
                                        <Zap className={cn("h-8 w-8", formData.jobType === 'spot' ? "text-blue-500 p-0.5 fill-blue-500" : "text-muted-foreground")} />
                                        <div>
                                            <div className={cn("font-bold text-base", formData.jobType === 'spot' ? "text-blue-600" : "text-foreground")}>Spot Job</div>
                                            <div className="text-xs font-medium text-muted-foreground mt-1">As soon as possible</div>
                                        </div>
                                    </button>
                                </div>

                                {formData.jobType === 'scheduled' && (
                                    <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Date</label>
                                            <Input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="bg-background border-input text-foreground h-12" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Time</label>
                                            <div className="flex gap-2">
                                                <div className="relative flex-1">
                                                    <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        type="text"
                                                        placeholder="--:--"
                                                        className="pl-9 bg-background border-input text-foreground h-12"
                                                        value={formData.time.split(' ')[0]}
                                                        onChange={e => {
                                                            const val = e.target.value;
                                                            // Simple mask for HH:MM
                                                            if (val.length <= 5) {
                                                                const ampm = formData.time.split(' ')[1] || 'AM';
                                                                setFormData({ ...formData, time: `${val} ${ampm}` });
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <select
                                                    className="bg-background border border-input rounded-md px-3 text-foreground w-20 h-12 focus:ring-2 focus:ring-ring focus:outline-none"
                                                    value={formData.time.split(' ')[1] || 'AM'}
                                                    onChange={e => {
                                                        const timePart = formData.time.split(' ')[0] || '--:--';
                                                        setFormData({ ...formData, time: `${timePart} ${e.target.value}` });
                                                    }}
                                                >
                                                    <option value="AM">AM</option>
                                                    <option value="PM">PM</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    {['Low', 'Medium', 'High', 'Critical'].map(level => (
                                        <button
                                            key={level}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, urgency: level })}
                                            className={cn(
                                                "flex-1 py-2 text-xs font-medium rounded-md border transition-all",
                                                formData.urgency === level
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "bg-card text-foreground border-border hover:bg-secondary"
                                            )}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-foreground">Budget Estimate</h2>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                    <Input
                                        type="number"
                                        className="pl-8 bg-background border-input text-foreground"
                                        placeholder="0.00"
                                        value={formData.budget}
                                        onChange={e => setFormData({ ...formData, budget: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                </form>
            </div>

            {/* Footer Actions */}
            <div className="bg-card border-t border-border p-4 pb-safe sticky bottom-0">
                <div className="max-w-lg mx-auto w-full">
                    {step < 4 ? (
                        <Button className="w-full" onClick={handleNext} disabled={step === 1 && !formData.category}>
                            Next Step <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                    ) : (
                        <Button className="w-full" onClick={handleSubmit} isLoading={isSubmitting}>
                            Post Job Now
                        </Button>
                    )}
                </div>
            </div>

        </div>
    );
}
