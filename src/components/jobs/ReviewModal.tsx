import { useState } from 'react';
import { Star, X, ThumbsUp, Medal, Clock, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import { toast } from 'react-hot-toast';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    workerName: string;
    workerImage: string;
}

export const ReviewModal = ({ isOpen, onClose, workerName, workerImage }: ReviewModalProps) => {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [comment, setComment] = useState('');

    const tags = [
        { id: 'punctual', label: 'Punctual', icon: Clock },
        { id: 'expert', label: 'Expert', icon: Medal },
        { id: 'polite', label: 'Polite', icon: ThumbsUp },
        { id: 'friendly', label: 'Friendly', icon: Heart },
    ];

    const toggleTag = (id: string) => {
        setSelectedTags(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    };

    const handleSubmit = () => {
        // Here you would normally submit to backend
        console.log({ rating, selectedTags, comment });
        toast.success("Review submitted! Thank you.");
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-card w-full max-w-md rounded-3xl shadow-2xl border border-border overflow-hidden"
                    >
                        <div className="relative h-32 bg-primary/10">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/30 rounded-full text-foreground/80 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                                <div className="h-24 w-24 rounded-full border-4 border-card bg-secondary overflow-hidden shadow-lg">
                                    <img src={workerImage} alt={workerName} className="h-full w-full object-cover" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-12 pb-8 px-6 text-center space-y-6">
                            <div>
                                <h3 className="text-2xl font-black text-foreground">Rate {workerName}</h3>
                                <p className="text-muted-foreground">How was your service experience?</p>
                            </div>

                            {/* Stars */}
                            <div className="flex justify-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        onClick={() => setRating(star)}
                                        className="transition-transform hover:scale-110 focus:outline-none"
                                    >
                                        <Star
                                            className={cn(
                                                "h-10 w-10 transition-colors",
                                                (hoveredRating || rating) >= star
                                                    ? "fill-yellow-500 text-yellow-500"
                                                    : "fill-transparent text-muted-foreground/30"
                                            )}
                                        />
                                    </button>
                                ))}
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap justify-center gap-2">
                                {tags.map((tag) => (
                                    <button
                                        key={tag.id}
                                        onClick={() => toggleTag(tag.id)}
                                        className={cn(
                                            "flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-bold border transition-all",
                                            selectedTags.includes(tag.id)
                                                ? "bg-primary/10 border-primary text-primary"
                                                : "bg-secondary border-transparent text-muted-foreground hover:bg-secondary/80"
                                        )}
                                    >
                                        <tag.icon className="h-3.5 w-3.5" />
                                        <span>{tag.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Comment */}
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Write a review (optional)..."
                                className="w-full bg-secondary/30 border border-border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[80px]"
                            />

                            <Button onClick={handleSubmit} className="w-full h-12 text-lg rounded-xl" disabled={rating === 0}>
                                Submit Review
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
