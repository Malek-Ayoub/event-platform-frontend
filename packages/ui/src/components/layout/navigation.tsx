import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '../../lib/utils.js';

const navigationLinkVariants = cva(
  'inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
  {
    variants: {
      active: {
        true: 'bg-surface text-foreground',
        false: 'text-muted-foreground',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

export type NavigationProps = ComponentPropsWithoutRef<'nav'>;

export const Navigation = forwardRef<HTMLElement, NavigationProps>(
  ({ className, ...props }, ref) => (
    <nav
      ref={ref}
      className={cn('flex items-center', className)}
      data-slot="navigation"
      {...props}
    />
  ),
);
Navigation.displayName = 'Navigation';

export type NavigationListProps = ComponentPropsWithoutRef<'ul'>;

export const NavigationList = forwardRef<HTMLUListElement, NavigationListProps>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      className={cn('flex flex-wrap items-center gap-1', className)}
      data-slot="navigation-list"
      {...props}
    />
  ),
);
NavigationList.displayName = 'NavigationList';

export type NavigationGroupProps = ComponentPropsWithoutRef<'li'> & {
  label?: string;
};

export const NavigationGroup = forwardRef<HTMLLIElement, NavigationGroupProps>(
  ({ className, label, children, ...props }, ref) => (
    <li
      ref={ref}
      className={cn('flex list-none flex-col gap-1', className)}
      data-slot="navigation-group"
      {...props}
    >
      {label ? (
        <span className="px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      ) : null}
      <ul className="flex flex-wrap items-center gap-1">{children}</ul>
    </li>
  ),
);
NavigationGroup.displayName = 'NavigationGroup';

export type NavigationItemProps = ComponentPropsWithoutRef<'li'>;

export const NavigationItem = forwardRef<HTMLLIElement, NavigationItemProps>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn('list-none', className)} data-slot="navigation-item" {...props} />
  ),
);
NavigationItem.displayName = 'NavigationItem';

export type NavigationLinkProps = ComponentPropsWithoutRef<'a'> &
  VariantProps<typeof navigationLinkVariants> & {
    asChild?: boolean;
  };

export const NavigationLink = forwardRef<HTMLAnchorElement, NavigationLinkProps>(
  ({ className, active, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'a';

    return (
      <Comp
        ref={ref}
        className={cn(navigationLinkVariants({ active, className }))}
        data-slot="navigation-link"
        aria-current={active ? 'page' : undefined}
        {...props}
      />
    );
  },
);
NavigationLink.displayName = 'NavigationLink';

export { navigationLinkVariants };
