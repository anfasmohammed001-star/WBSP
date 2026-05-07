import { useState } from 'react';
import { MessageSquarePlus, X, Star, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';

export function FeedbackWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [rating, setRating] = useState(0);

    const handleSubmit = () => {
        setSubmitted(true);
        setTimeout(() => {
            setIsOpen(false);
            setSubmitted(false);
            setRating(0);
        }, 2000);
    };

    return (
        <div className="fixed bottom-24 left-6 z-40">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="bg-card border border-border rounded-3xl p-6 shadow-2xl mb-4 w-72"
                    >
                        {!submitted ? (
                            <>
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-bold text-lg">Feedback</h3>
                                    <button onClick={() => setIsOpen(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">How are you enjoying the app?</p>
                                <div className="flex justify-between mb-6">
                                    {[1, 2, 3, 4, 5].map((r) => (
                                        <button key={r} onClick={() => setRating(r)} className="transition-transform hover:scale-110">
                                            <Star className={`h-8 w-8 ${r <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`} />
                                        </button>
                                    ))}
                                </div>
                                <Button className="w-full" disabled={rating === 0} onClick={handleSubmit}>
                                    Submit
                                </Button>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <div className="mx-auto bg-green-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                                    <Send className="h-6 w-6 text-green-500" />
                                </div>
                                <h4 className="font-bold">Thank You!</h4>
                                <p className="text-xs text-muted-foreground mt-1">Your feedback helps us improve.</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="bg-primary text-primary-foreground h-12 w-12 rounded-full flex items-center justify-center shadow-lg border-2 border-background"
            >
                <MessageSquarePlus className="h-6 w-6" />
            </motion.button>
        </div>
    );
}
