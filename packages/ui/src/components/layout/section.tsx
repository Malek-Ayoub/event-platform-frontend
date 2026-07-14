import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/utils.js';

const sectionVariants = cva('w-full', {
  variants: {
    spacing: {
      none: 'py-0',
      sm: 'py-8',
      md: 'py-12',
      lg: 'py-16',
      xl: 'py-24',
    },
    variant: {
      default: 'bg-background',
      muted: 'bg-surface',
      primary: 'bg-primary text-primary-foreground',
    },
  },
  defaultVariants: {
    spacing: 'md',
    variant: 'default',
  },
});

export type SectionProps = HTMLAttributes<HTMLElement> & VariantProps<typeof sectionVariants>;

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, spacing, variant, ...props }, ref) => (
    <section
      ref={ref}
      className={cn(sectionVariants({ spacing, variant, className }))}
      {...props}
    />
  ),
);

Section.displayName = 'Section';

export { sectionVariants };
