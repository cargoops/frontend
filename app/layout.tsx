import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
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
