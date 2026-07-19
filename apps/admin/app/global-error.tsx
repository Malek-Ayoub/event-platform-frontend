'use client';

import { useEffect } from 'react';
import NextError from 'next/error';
import * as Sentry from '@sentry/nextjs';

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        {/* statusCode=0 renders a generic App Router error page. */}
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
