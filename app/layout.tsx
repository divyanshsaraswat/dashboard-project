import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Performance Dashboard',
  description: 'High-performance real-time data visualization dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          {children}
        </div>
      </body>
    </html>
  );
}

