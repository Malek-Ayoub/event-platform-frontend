import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Event Platform — Organizer',
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
