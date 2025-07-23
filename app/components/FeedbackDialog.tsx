"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FaStar } from "react-icons/fa";

export function FeedbackDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [rating, setRating] = useState(5);
    const [loading, setLoading] = useState(false);
    const [hover, setHover] = useState(0);

    const handleSubmit = async (_e: React.FormEvent<HTMLFormElement>) => {
        _e.preventDefault();
        setLoading(true);

        const formData = new FormData(_e.currentTarget);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            rating,
            websiteQuality: formData.get('websiteQuality'),
            userExperience: formData.get('userExperience'),
        };

        try {
            const response = await fetch('/api/send-feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed to send feedback');

            toast.success('Thank you for your feedback!');
            onClose();
        } catch (_error) {
            toast.error('Failed to send feedback. Please try again.');

        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Help Us Improve!</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input name="name" placeholder="Your Name" required />
                    <Input name="email" type="email" placeholder="Your Email" required />
                    <Input name="phone" placeholder="Your Phone" required />
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Rate your experience:</label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    type="button"
                                    key={star}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                    className="text-2xl focus:outline-none"
                                >
                                    <FaStar 
                                        className={`${
                                            star <= (hover || rating)
                                                ? "text-yellow-400"
                                                : "text-gray-300"
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <Textarea 
                        name="websiteQuality" 
                        placeholder="How would you rate our website quality?"
                        required
                    />
                    <Textarea 
                        name="userExperience" 
                        placeholder="How was your overall experience?"
                        required
                    />
                    
                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? 'Sending...' : 'Submit Feedback'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}