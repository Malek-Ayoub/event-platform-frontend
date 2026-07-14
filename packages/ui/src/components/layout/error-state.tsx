import type { ReactNode } from 'react';
import { cn } from '../../lib/utils.js';
import { Alert, AlertDescription, AlertTitle } from '../alert.js';

export type ErrorStateProps = {
  title?: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function ErrorState({
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  action,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn('max-w-2xl', className)} data-slot="error-state">
      <Alert variant="danger">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Alert>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export { ErrorState as Error };
