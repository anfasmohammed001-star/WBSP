import React from 'react';
import { Search, ChevronLeft, Calendar, Filter, User, FileText, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const JOB_HISTORY_DATA = [
    {
        id: '1',
        title: 'Industrial HVAC Maintenance',
        price: '$450.00',
        status: 'COMPLETED',
        date: 'Oct 24, 2023',
        worker: {
            name: 'Alex Rivera',
            role: 'Senior HVAC Technician',
            avatar: 'https://ui-avatars.com/api/?name=Alex+Rivera&background=0D8ABC&color=fff',
            rating: 5.0
        },
        image: 'https://images.unsplash.com/photo-1581094794329-cd1361ddee2d?auto=format&fit=crop&q=80&w=200&h=200'
    },
    {
        id: '2',
        title: 'Smart Security Installation',
        price: '$1,200.00',
        status: 'COMPLETED',
        date: 'Oct 12, 2023',
        worker: {
            name: 'Sarah Chen',
            role: 'Security Specialist',
            avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=10B981&color=fff',
            rating: 4.9
        },
        image: 'https://images.unsplash.com/photo-1558002038-1091a1661116?auto=format&fit=crop&q=80&w=200&h=200'
    },
    {
        id: '3',
        title: 'Electrical Panel Upgrade',
        price: '$890.00',
        status: 'COMPLETED',
        date: 'Sep 28, 2023',
        worker: {
            name: 'James Wilson',
            role: 'Master Electrician',
            avatar: 'https://ui-avatars.com/api/?name=James+Wilson&background=F59E0B&color=fff',
            rating: 4.8
        },
        image: 'https://images.unsplash.com/photo-1621905208269-82d9c4888027?auto=format&fit=crop&q=80&w=200&h=200'
    }
];

export default function JobHistoryPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-slate-50/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-white rounded-full transition-colors">
                        <ChevronLeft className="w-6 h-6 text-slate-800" />
                    </button>
                    <h1 className="text-xl font-bold text-slate-900">Job History</h1>
                </div>
                <button className="p-2 hover:bg-white rounded-full transition-colors">
                    <Search className="w-6 h-6 text-slate-800" />
                </button>
            </header>

            {/* Filters */}
            <div className="px-6 mb-6">
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold whitespace-nowrap border border-emerald-200">
                        Status
                        <ChevronDownIcon className="w-3 h-3" />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 rounded-full text-sm font-semibold whitespace-nowrap border border-slate-200 shadow-sm">
                        Date Range
                        <Calendar className="w-3 h-3 text-slate-400" />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 rounded-full text-sm font-semibold whitespace-nowrap border border-slate-200 shadow-sm">
                        Worker Type
                        <User className="w-3 h-3 text-slate-400" />
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="px-6 space-y-4">
                {JOB_HISTORY_DATA.map((job) => (
                    <div key={job.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                        {/* Top Row: Details & Image */}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className="inline-block px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold tracking-wider uppercase rounded-md mb-2">
                                    {job.status}
                                </span>
                                <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1 pr-4">{job.title}</h3>
                                <p className="text-emerald-500 font-bold text-xl">{job.price}</p>
                            </div>
                            <img src={job.image} alt={job.title} className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                        </div>

                        <hr className="border-slate-50 my-4" />

                        {/* Worker Row */}
                        <div className="flex justify-between items-center mb-5">
                            <div className="flex items-center gap-3">
                                <img src={job.worker.avatar} alt={job.worker.name} className="w-10 h-10 rounded-full" />
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">{job.worker.name}</p>
                                    <p className="text-xs text-slate-400">{job.worker.role}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-1 text-amber-400">
                                    <span className="text-sm font-bold text-slate-900">{job.worker.rating}</span>
                                    <StarIcon className="w-3 h-3 fill-current" />
                                </div>
                                <span className="text-[10px] text-slate-300 font-medium">{job.date}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button className="flex-1 py-3 px-4 border border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors">
                                <FileText className="w-4 h-4 text-emerald-500" />
                                Invoice
                            </button>
                            <button className="flex-1 py-3 px-4 bg-emerald-400 text-white rounded-2xl flex items-center justify-center gap-2 font-bold text-sm shadow-lg shadow-emerald-200 hover:bg-emerald-500 transition-colors">
                                Details
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ChevronDownIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6" /></svg>
    )
}

function StarIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg>
    )
}
