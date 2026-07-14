import { cn } from '../../lib/utils.js';
import { Skeleton } from '../skeleton.js';

export type LoadingStateProps = {
  title?: string;
  description?: string;
  className?: string;
};

export function LoadingState({
  title = 'Loading',
  description = 'Please wait while content is being prepared.',
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn('space-y-6', className)}
      data-slot="loading-state"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}

export type InlineLoadingProps = {
  label?: string;
  className?: string;
};

export function InlineLoading({ label = 'Loading', className }: InlineLoadingProps) {
  return (
    <div
      className={cn('inline-flex items-center gap-2 text-sm text-muted-foreground', className)}
      data-slot="inline-loading"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-primary" />
      <span>{label}</span>
    </div>
  );
}

export type LoadingProps = LoadingStateProps & {
  variant?: 'page' | 'inline';
  inlineLabel?: string;
};

export function Loading({ variant = 'page', inlineLabel, ...props }: LoadingProps) {
  if (variant === 'inline') {
    return <InlineLoading label={inlineLabel ?? props.title} className={props.className} />;
  }

  return <LoadingState {...props} />;
}
