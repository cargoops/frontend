import type { Metadata } from 'next'
import './globals.css';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'WMS UI',
  description: 'Simple Warehouse Management System UI',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <div style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
          <h2>WMS UI Demo</h2>
        </div>
        <main style={{ padding: '1rem' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
