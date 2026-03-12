import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Level Clear - Your Alcohol-Free Journey',
  description: 'The 60+1 Day Challenge. Build the foundation to elevate your life.',
  keywords: 'sobriety, recovery, alcohol-free, challenge, community',
  authors: [{ name: 'J Brandon Foster' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a0a0a" />
      </head>
      <body className="bg-dark-bg text-white font-system">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
