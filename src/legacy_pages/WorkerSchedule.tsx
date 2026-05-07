import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar as CalendarIcon, Clock, CheckCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { toast } from 'react-hot-toast';

export default function WorkerSchedule() {
    const navigate = useNavigate();

    // Days of the week
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    // Time slots
    const slots = ['Morning (8am-12pm)', 'Afternoon (12pm-4pm)', 'Evening (4pm-8pm)'];

    // State to track availability: string key "Day-SlotIndex"
    // Pre-filled with some data
    const [availability, setAvailability] = useState<Set<string>>(new Set([
        'Mon-0', 'Mon-1', 'Tue-0', 'Tue-1', 'Wed-0', 'Wed-1', 'Thu-0', 'Fri-0'
    ]));

    const toggleSlot = (day: string, slotIndex: number) => {
        const key = `${day}-${slotIndex}`;
        setAvailability(prev => {
            const newSet = new Set(prev);
            if (newSet.has(key)) {
                newSet.delete(key);
            } else {
                newSet.add(key);
            }
            return newSet;
        });
    };

    const handleSave = () => {
        toast.success("Schedule updated successfully!");
        // Backend sync would happen here
    };

    return (
        <div className="bg-background min-h-screen text-foreground pb-20">
            {/* Header */}
            <header className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-xl hover:bg-secondary transition-colors"
                >
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <h1 className="text-lg font-bold">Availability Manager</h1>
                <div className="w-10" />
            </header>

            <div className="p-4 space-y-6">
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 flex items-start space-x-3">
                    <CalendarIcon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-bold text-sm text-foreground">Set Your Weekly Stats</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                            Tap slots to mark them as <span className="text-green-500 font-bold">Available</span>.
                            Unselected slots will show as offline to customers.
                        </p>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="space-y-4">
                    {days.map((day) => (
                        <div key={day} className="bg-card rounded-2xl border border-border overflow-hidden">
                            <div className="bg-secondary/50 px-4 py-2 border-b border-border flex items-center justify-between">
                                <span className="font-bold text-sm">{day}</span>
                                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                                    {[0, 1, 2].some(i => availability.has(`${day}-${i}`)) ? 'Online' : 'Off'}
                                </span>
                            </div>
                            <div className="p-2 grid grid-cols-3 gap-2">
                                {slots.map((slot, index) => {
                                    const isAvailable = availability.has(`${day}-${index}`);
                                    const slotLabel = slot.split(' ')[0]; // Morning, Afternoon etc
                                    const timeLabel = slot.split('(')[1].replace(')', '');

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => toggleSlot(day, index)}
                                            className={cn(
                                                "flex flex-col items-center justify-center p-3 rounded-xl transition-all border",
                                                isAvailable
                                                    ? "bg-green-500/10 border-green-500 text-green-700"
                                                    : "bg-secondary/20 border-transparent text-muted-foreground hover:bg-secondary"
                                            )}
                                        >
                                            {isAvailable ? <CheckCircle className="h-4 w-4 mb-1" /> : <Clock className="h-4 w-4 mb-1 opacity-50" />}
                                            <span className="text-xs font-bold">{slotLabel}</span>
                                            <span className="text-[10px] opacity-70">{timeLabel}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sticky Save Button */}
            <div className="fixed bottom-0 inset-x-0 p-4 bg-background border-t border-border z-20">
                <Button onClick={handleSave} className="w-full text-lg h-12 shadow-lg shadow-primary/20">
                    Save Changes
                </Button>
            </div>
        </div>
    );
}
