import type { Metadata } from 'next'
import './globals.css';

export const metadata: Metadata = {
  title: 'WMS UI',
  description: 'Simple Warehouse Management System UI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossOrigin="anonymous"></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossOrigin="anonymous"></script>
      </head>
      <body>
        <div style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
          <h2>WMS UI Demo</h2>
        </div>
        <main style={{ padding: '1rem' }}>
          {children}
        </main>
        <script>
          {`
            window.addEventListener('load', function() {
              console.log('Page loaded');
              if (typeof window.React !== 'undefined') {
                console.log('React loaded');
              }
            });
          `}
        </script>
      </body>
    </html>
  );
}
