import React from 'react'
import ReactDOM from 'react-dom/client'
import { startRealtimeSync } from './services/realtimeService'
import App from './App.tsx'
import './index.css'

// Initialize Realtime Sync
startRealtimeSync();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
