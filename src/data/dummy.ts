export const DUMMY_DATA = {
    CUSTOMER: {
        name: "Alex Johnson",
        stats: {
            pendingJobs: 3,
            completedJobs: 12,
            totalSpent: 450.00
        },
        recentActivity: [
            { id: 1, type: 'job_posted', title: 'Plumbing Repair', date: '2 hours ago', status: 'pending' },
            { id: 2, type: 'worker_hired', title: 'Garden Maintenance', date: '1 day ago', status: 'active' },
            { id: 3, type: 'job_completed', title: 'House Cleaning', date: '3 days ago', status: 'completed' }
        ]
    },
    WORKER: {
        name: "Sarah Smith",
        rating: 4.8,
        jobsCompleted: 45,
        earnings: {
            today: 85.00,
            week: 420.50,
            month: 1850.00
        },
        activeJobs: [
            {
                id: 101,
                title: "Fix Leaking Faucet",
                location: "123 Main St, Downtown",
                distance: "2.5 km",
                price: 45.00,
                time: "Today, 2:00 PM",
                status: "active"
            },
            {
                id: 102,
                title: "Install Ceiling Fan",
                location: "45 Park Ave, Westside",
                distance: "5.1 km",
                price: 60.00,
                time: "Tomorrow, 10:00 AM",
                status: "upcoming"
            }
        ]
    }
};
