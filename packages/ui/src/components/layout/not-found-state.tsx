import type { ReactNode } from 'react';
import { cn } from '../../lib/utils.js';

export type NotFoundStateProps = {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function NotFoundState({
  title = 'Page not found',
  description = 'The page you are looking for does not exist or may have been moved.',
  action,
  className,
}: NotFoundStateProps) {
  return (
    <div className={cn('max-w-2xl space-y-4', className)} data-slot="not-found-state">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">404</p>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

export { NotFoundState as NotFound };
