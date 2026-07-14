import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
} from 'react';
import { cn } from '../../lib/utils.js';

export const Drawer = DialogPrimitive.Root;
export const DrawerTrigger = DialogPrimitive.Trigger;
export const DrawerClose = DialogPrimitive.Close;
export const DrawerPortal = DialogPrimitive.Portal;

export const DrawerOverlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-50 bg-black/50', className)}
    data-slot="drawer-overlay"
    {...props}
  />
));
DrawerOverlay.displayName = DialogPrimitive.Overlay.displayName;

const drawerContentVariants = cva(
  'fixed z-50 flex flex-col border border-border bg-background shadow-lg outline-none',
  {
    variants: {
      side: {
        left: 'inset-y-0 left-0 h-full w-3/4 max-w-sm border-r',
        right: 'inset-y-0 right-0 h-full w-3/4 max-w-sm border-l',
        top: 'inset-x-0 top-0 w-full border-b',
        bottom: 'inset-x-0 bottom-0 w-full border-t',
      },
    },
    defaultVariants: {
      side: 'left',
    },
  },
);

export type DrawerContentProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Content> &
  VariantProps<typeof drawerContentVariants> & {
    showClose?: boolean;
  };

export const DrawerContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  DrawerContentProps
>(({ side = 'left', className, children, showClose = true, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(drawerContentVariants({ side }), className)}
      data-slot="drawer-content"
      {...props}
    >
      {children}
      {showClose ? (
        <DialogPrimitive.Close
          className="absolute right-4 top-4 rounded-md opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          data-slot="drawer-close"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      ) : null}
    </DialogPrimitive.Content>
  </DrawerPortal>
));
DrawerContent.displayName = DialogPrimitive.Content.displayName;

export const DrawerHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col gap-1.5 p-6 pb-0', className)}
    data-slot="drawer-header"
    {...props}
  />
);

export const DrawerTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold leading-none', className)}
    {...props}
  />
));
DrawerTitle.displayName = DialogPrimitive.Title.displayName;

export const DrawerDescription = forwardRef<
  ElementRef<typeof DialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
DrawerDescription.displayName = DialogPrimitive.Description.displayName;

export const DrawerBody = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex-1 overflow-y-auto p-6', className)} data-slot="drawer-body" {...props} />
);
