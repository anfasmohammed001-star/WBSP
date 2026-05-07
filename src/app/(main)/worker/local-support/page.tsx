'use client';

import { useNavigate } from 'react-router-dom';

export default function LocalSupport() {
    const navigate = useNavigate();

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">Local Support (Debug)</h1>
            <p className="text-muted-foreground">This page is temporarily simplified for build verification.</p>
            <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-secondary rounded">
                Back
            </button>
        </div>
    );
}
