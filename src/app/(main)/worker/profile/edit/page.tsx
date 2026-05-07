'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Upload, Plus, X, Image as ImageIcon, Award, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
// import { Button } from '@/components/ui/Button';

export default function WorkerProfileEditor() {
    const navigate = useNavigate();

    const [skills, setSkills] = useState(['Plumbing', 'Pipe Repair', 'Leak Detection']);
    const [newSkill, setNewSkill] = useState('');

    const [portfolio, setPortfolio] = useState([
        'https://images.unsplash.com/photo-1584622781867-151784ac0e90?auto=format&fit=crop&w=200&q=80',
        'https://images.unsplash.com/photo-1595515107205-0c8609e1e276?auto=format&fit=crop&w=200&q=80'
    ]);

    const addSkill = () => {
        if (newSkill && !skills.includes(newSkill)) {
            setSkills([...skills, newSkill]);
            setNewSkill('');
        }
    };

    const removeSkill = (skill: string) => {
        setSkills(skills.filter(s => s !== skill));
    };

    return (
        <div className="bg-background min-h-screen pb-24 text-foreground">
            {/* Header */}
            <header className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-secondary">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <h1 className="text-lg font-black">Edit Profile</h1>
                <div className="w-10"></div>
            </header>

            <div className="p-4 space-y-8">

                {/* Skills Section */}
                <section>
                    <div className="flex items-center space-x-2 mb-4">
                        <Briefcase className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-bold">Skills & Expertise</h2>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {skills.map(skill => (
                            <div key={skill} className="bg-secondary text-secondary-foreground px-3 py-1.5 rounded-lg text-sm font-bold flex items-center">
                                {skill}
                                <button onClick={() => removeSkill(skill)} className="ml-2 hover:text-red-500">
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            placeholder="Add a new skill..."
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                            className="flex-1 bg-card border border-border rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <button onClick={addSkill} className="bg-primary text-primary-foreground p-2 rounded-xl">
                            <Plus className="h-5 w-5" />
                        </button>
                    </div>
                </section>

                <hr className="border-border" />

                {/* Portfolio Section */}
                <section>
                    <div className="flex items-center space-x-2 mb-4">
                        <ImageIcon className="h-5 w-5 text-purple-500" />
                        <h2 className="text-lg font-bold">Portfolio</h2>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {portfolio.map((img, i) => (
                            <div key={i} className="aspect-square rounded-xl overflow-hidden relative group">
                                <img src={img} alt="Portfolio" className="w-full h-full object-cover" />
                                <button className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                        <button className="aspect-square rounded-xl bg-secondary/50 border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:bg-secondary transition-colors">
                            <Plus className="h-6 w-6 mb-1" />
                            <span className="text-[10px] font-bold">Add Photo</span>
                        </button>
                    </div>
                </section>

                <hr className="border-border" />

                {/* Certifications Section */}
                <section>
                    <div className="flex items-center space-x-2 mb-4">
                        <Award className="h-5 w-5 text-orange-500" />
                        <h2 className="text-lg font-bold">Certifications</h2>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-card border border-border rounded-xl">
                            <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500">
                                    <Award className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold">Licensed Master Plumber</h4>
                                    <p className="text-[10px] text-muted-foreground">Issued Dec 2022</p>
                                </div>
                            </div>
                            <button className="text-xs font-bold text-red-500">Remove</button>
                        </div>
                        <button className="w-full py-3 border-2 border-dashed border-border rounded-xl text-sm font-bold text-muted-foreground hover:bg-secondary transition-colors flex items-center justify-center space-x-2">
                            <Upload className="h-4 w-4" />
                            <span>Upload Certificate</span>
                        </button>
                    </div>
                </section>

            </div>

            {/* Sticky Save Button */}
            <div className="fixed bottom-0 inset-x-0 p-4 bg-background border-t border-border z-20">
                <button className="w-full text-lg h-12 shadow-lg shadow-primary/20 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-medium">
                    Save Profile
                </button>
            </div>
        </div>
    );
}
