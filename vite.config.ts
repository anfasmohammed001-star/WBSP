import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import https from 'https'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        proxy: {
            '/supabase-proxy': {
                target: 'https://cwkzwvaobqayuvgirvqn.supabase.co',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/supabase-proxy/, ''),
                agent: new https.Agent({
                    // Manual IP resolution to bypass DNS hijacking (Jio/Airtel)
                    lookup: (hostname, options, callback) => {
                        if (hostname === 'cwkzwvaobqayuvgirvqn.supabase.co') {
                            callback(null, [{ address: '104.18.38.10', family: 4 }]);
                        } else {
                            require('dns').lookup(hostname, options, callback);
                        }
                    }
                }),
                configure: (proxy, options) => {
                    proxy.on('error', (err, req, res) => {
                        console.error('Proxy Error:', err);
                        if (!res.headersSent) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Supabase Bridge Error', details: err.message }));
                        }
                    });
                }
            }
        }
    }
})
