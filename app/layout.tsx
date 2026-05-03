import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import { AuthProvider } from '@/components/AuthProvider';
import ErrorBoundary from '@/components/ErrorBoundary';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap', // prevents FOIT, improves LCP
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ElectoAI | Your Personal Election Assistant',
  description:
    'Understand the election process, timelines, and voting steps with AI-driven guidance. Powered by Gemini AI.',
  keywords: ['election', 'voting', 'voter registration', 'India', 'ECI', 'AI assistant'],
  authors: [{ name: 'ElectoAI' }],
  openGraph: {
    title: 'ElectoAI | Your Personal Election Assistant',
    description: 'AI-powered guidance for every voter in India.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        {/* Preconnect to Google APIs to reduce LCP latency */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://generativelanguage.googleapis.com" />
      </head>
      <body className="min-h-full flex flex-col">
        {/* Skip to Main Content Link for Keyboard Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:shadow-lg focus:font-bold"
        >
          Skip to main content
        </a>

        <AuthProvider>
          <Header />
          <main id="main-content" className="flex-1 outline-none" tabIndex={-1}>
            <ErrorBoundary>{children}</ErrorBoundary>
          </main>
          <footer className="border-t py-12 bg-accent/30">
            <div className="container mx-auto px-4 text-center">
              <p className="text-sm text-secondary font-medium">
                © {new Date().getFullYear()} ElectoAI. Built for informed citizenship.
              </p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
