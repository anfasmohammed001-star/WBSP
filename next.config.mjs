/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'i.pravatar.cc' },
            { protocol: 'https', hostname: 'source.unsplash.com' },
            { protocol: 'https', hostname: 'www.transparenttextures.com' },
            { protocol: 'https', hostname: 'api.mapbox.com' }
        ],
    },
    transpilePackages: ['lucide-react'],
};

export default nextConfig;
