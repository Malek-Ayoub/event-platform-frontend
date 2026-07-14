import type { ReactNode } from 'react';
import { cn } from '../../lib/utils.js';
import { Container } from './container.js';

export type FooterProps = {
  brand?: ReactNode;
  navigation?: ReactNode;
  meta?: ReactNode;
  className?: string;
  containerClassName?: string;
  innerClassName?: string;
};

export function Footer({
  brand,
  navigation,
  meta,
  className,
  containerClassName,
  innerClassName,
}: FooterProps) {
  return (
    <div className={cn('w-full', className)} data-slot="footer">
      <Container className={containerClassName}>
        <div
          className={cn(
            'flex flex-col gap-6 py-10 md:flex-row md:items-start md:justify-between',
            innerClassName,
          )}
          data-slot="footer-inner"
        >
          {brand ? <div data-slot="footer-brand">{brand}</div> : null}
          {navigation ? <div data-slot="footer-navigation">{navigation}</div> : null}
          {meta ? (
            <div className="text-sm text-muted-foreground" data-slot="footer-meta">
              {meta}
            </div>
          ) : null}
        </div>
      </Container>
    </div>
  );
}
