import './globals.css';
import { Providers } from './providers';
// Metadata removed as it is Next.js specific

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            </head>
            <body className="font-sans antialiased text-foreground bg-background">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
