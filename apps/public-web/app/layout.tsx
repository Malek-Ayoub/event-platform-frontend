import type { Metadata } from 'next';
import { APP_NAMES } from '@event-platform/shared';
import './globals.css';

export const metadata: Metadata = {
  title: APP_NAMES.publicWeb,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
