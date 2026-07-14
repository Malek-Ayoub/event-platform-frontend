import type { ReactNode } from 'react';
import { cn } from '../../lib/utils.js';
import { Container } from './container.js';

export type HeaderProps = {
  brand?: ReactNode;
  navigation?: ReactNode;
  actions?: ReactNode;
  className?: string;
  containerClassName?: string;
  innerClassName?: string;
};

export function Header({
  brand,
  navigation,
  actions,
  className,
  containerClassName,
  innerClassName,
}: HeaderProps) {
  return (
    <div className={cn('w-full', className)} data-slot="header">
      <Container className={containerClassName}>
        <div
          className={cn('flex h-16 items-center justify-between gap-4', innerClassName)}
          data-slot="header-inner"
        >
          <div className="flex min-w-0 items-center gap-6" data-slot="header-brand-group">
            {brand ? (
              <div className="flex min-w-0 items-center gap-3" data-slot="header-brand">
                {brand}
              </div>
            ) : null}
            {navigation ? <div data-slot="header-navigation">{navigation}</div> : null}
          </div>
          {actions ? (
            <div className="flex shrink-0 items-center gap-2" data-slot="header-actions">
              {actions}
            </div>
          ) : null}
        </div>
      </Container>
    </div>
  );
}
