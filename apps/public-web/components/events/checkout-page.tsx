'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@event-platform/ui';
import { Container, ErrorState, LoadingState, Section } from '@event-platform/ui/layout';
import { ApiError } from '@event-platform/api-client/core';
import { formatCurrency } from '@event-platform/shared';
import { useEventDetailQuery } from '@/components/events/events.query';
import type { EventDetailTicketTypeViewModel } from '@/components/events/events.query';
import {
  useCreatePublicOrderMutation,
  type CreatePublicOrderRequest,
  type PublicOrderResource,
} from '@/components/events/orders.query';

type CheckoutLineItem = {
  ticketType: EventDetailTicketTypeViewModel;
  quantity: number;
  subtotal: number;
};

type CustomerFormValues = {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
};

export type ParsedCheckoutItem = {
  ticketTypeId: string;
  quantity: number;
};

export function parseCheckoutItems(rawItems: string | undefined | null): ParsedCheckoutItem[] {
  if (!rawItems || rawItems.trim().length === 0) {
    return [];
  }

  const parsed: ParsedCheckoutItem[] = [];

  for (const part of rawItems.split(',')) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    const [rawId, rawQty] = trimmed.split(':');
    if (!rawId || rawQty === undefined) continue;

    const quantity = Number.parseInt(rawQty, 10);
    if (!Number.isFinite(quantity)) continue;

    parsed.push({ ticketTypeId: rawId.trim(), quantity });
  }

  return parsed;
}

function resolveCheckoutLineItems(
  ticketTypes: EventDetailTicketTypeViewModel[],
  rawItems: string | undefined | null,
): CheckoutLineItem[] | null {
  const parsed = parseCheckoutItems(rawItems);
  if (parsed.length === 0) {
    return null;
  }

  const byId = new Map(ticketTypes.map((ticketType) => [ticketType.id, ticketType]));
  const lines: CheckoutLineItem[] = [];

  for (const item of parsed) {
    const ticketType = byId.get(item.ticketTypeId);
    if (!ticketType) return null;
    if (!ticketType.isAvailable) return null;
    if (item.quantity < 1 || item.quantity > ticketType.remaining) return null;

    lines.push({
      ticketType,
      quantity: item.quantity,
      subtotal: ticketType.priceAmount * item.quantity,
    });
  }

  return lines.length > 0 ? lines : null;
}

function formatOrderErrorMessage(error: ApiError): string {
  if (error.details && typeof error.details === 'object' && !Array.isArray(error.details)) {
    const parts = Object.values(error.details as Record<string, unknown>).flatMap((value) => {
      if (Array.isArray(value)) {
        return value.map(String);
      }
      if (typeof value === 'string') {
        return [value];
      }
      return [];
    });

    if (parts.length > 0) {
      return parts.join(' ');
    }
  }

  return error.message;
}

export function CheckoutPage({ slug, rawItems }: { slug: string; rawItems: string | undefined }) {
  const { data: event, isLoading, isError, error, refetch } = useEventDetailQuery(slug);
  const createOrder = useCreatePublicOrderMutation();
  const [placedOrder, setPlacedOrder] = useState<PublicOrderResource | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [fatalError, setFatalError] = useState<'404' | 'generic' | null>(null);
  const [lastPayload, setLastPayload] = useState<CreatePublicOrderRequest | null>(null);

  const form = useForm<CustomerFormValues>({
    defaultValues: {
      customer_name: '',
      customer_email: '',
      customer_phone: '',
    },
  });

  const lineItems = useMemo(() => {
    if (!event) return null;
    return resolveCheckoutLineItems(event.ticketTypes, rawItems);
  }, [event, rawItems]);

  const orderTotal = useMemo(() => {
    if (!lineItems || lineItems.length === 0) {
      return { amount: 0, currency: 'USD', label: formatCurrency(0) };
    }

    const amount = lineItems.reduce((sum, line) => sum + line.subtotal, 0);
    const currency = lineItems[0]?.ticketType.currency ?? 'USD';

    return {
      amount,
      currency,
      label: formatCurrency(amount, currency),
    };
  }, [lineItems]);

  const submitOrder = async (payload: CreatePublicOrderRequest) => {
    setFormError(null);
    setFatalError(null);
    setLastPayload(payload);

    try {
      const order = await createOrder.mutateAsync(payload);
      setPlacedOrder(order);
    } catch (submitError) {
      if (submitError instanceof ApiError) {
        if (submitError.status === 422) {
          setFormError(formatOrderErrorMessage(submitError));
          return;
        }

        if (submitError.status === 404) {
          setFatalError('404');
          return;
        }

        if (submitError.status === 429) {
          setFormError('too many attempts, try again in a minute');
          return;
        }
      }

      setFatalError('generic');
    }
  };

  const onSubmit = form.handleSubmit(async (values) => {
    if (!event || !lineItems) return;

    await submitOrder({
      event_id: Number(event.id),
      customer_name: values.customer_name.trim(),
      customer_email: values.customer_email.trim(),
      customer_phone: values.customer_phone.trim() || null,
      line_items: lineItems.map((line) => ({
        ticket_type_id: Number(line.ticketType.id),
        quantity: line.quantity,
      })),
    });
  });

  return (
    <Section spacing="lg" variant="muted" aria-label="Checkout">
      <Container className="space-y-6">
        {isLoading ? (
          <LoadingState title="Loading event" description="Fetching event details." />
        ) : null}

        {isError ? (
          error instanceof ApiError && error.status === 404 ? (
            <ErrorState
              title="Event not found"
              description="This event is no longer available."
              action={
                <Button asChild>
                  <Link href={`/events/${slug}`}>Back to event</Link>
                </Button>
              }
            />
          ) : (
            <ErrorState
              title="Unable to load event"
              description="We could not load this event right now. Please try again later."
              action={
                <Button type="button" onClick={() => void refetch()}>
                  Retry
                </Button>
              }
            />
          )
        ) : null}

        {!isLoading && !isError && event && lineItems === null ? (
          <ErrorState
            title="Your selection is no longer valid"
            description="The tickets you selected are no longer available. Please choose again."
            action={
              <Button asChild>
                <Link href={`/events/${slug}`}>Back to event</Link>
              </Button>
            }
          />
        ) : null}

        {!isLoading && !isError && event && lineItems && placedOrder ? (
          <div className="space-y-3" data-slot="order-confirmation">
            <h1 className="text-3xl font-semibold tracking-tight">Order placed</h1>
            <p className="text-sm">
              Order Number: <span className="font-medium">{placedOrder.order_number}</span>
            </p>
            <p className="text-sm text-muted-foreground">Status: {placedOrder.status}</p>
            <p className="text-sm">
              Total:{' '}
              <span className="font-medium">
                {formatCurrency(Number(placedOrder.total), orderTotal.currency)}
              </span>
            </p>
          </div>
        ) : null}

        {!isLoading && !isError && event && lineItems && !placedOrder && fatalError === '404' ? (
          <ErrorState
            title="Event not found"
            description="This event is no longer published."
            action={
              <Button asChild>
                <Link href={`/events/${slug}`}>Back to event</Link>
              </Button>
            }
          />
        ) : null}

        {!isLoading &&
        !isError &&
        event &&
        lineItems &&
        !placedOrder &&
        fatalError === 'generic' ? (
          <ErrorState
            title="Unable to place order"
            description="Something went wrong while creating your order. Please try again."
            action={
              <Button
                type="button"
                disabled={createOrder.isPending || !lastPayload}
                onClick={() => {
                  if (lastPayload) {
                    void submitOrder(lastPayload);
                  }
                }}
              >
                Retry
              </Button>
            }
          />
        ) : null}

        {!isLoading && !isError && event && lineItems && !placedOrder && fatalError === null ? (
          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
              <p className="text-sm text-muted-foreground">{event.title}</p>
            </div>

            <div className="space-y-4" data-slot="order-summary">
              <h2 className="text-xl font-semibold tracking-tight">Order summary</h2>
              <ul className="list-none space-y-3 p-0">
                {lineItems.map((line) => (
                  <li
                    key={line.ticketType.id}
                    className="flex items-start justify-between gap-4 text-sm"
                  >
                    <div>
                      <p className="font-medium">{line.ticketType.name}</p>
                      <p className="text-muted-foreground">Qty: {line.quantity}</p>
                    </div>
                    <p className="font-medium">
                      {formatCurrency(line.subtotal, line.ticketType.currency)}
                    </p>
                  </li>
                ))}
              </ul>
              <p className="border-t border-border pt-3 text-sm">
                Total: <span className="font-semibold">{orderTotal.label}</span>
              </p>
            </div>

            <Form {...form}>
              <form className="space-y-4" onSubmit={onSubmit} noValidate>
                {formError ? (
                  <p className="text-sm text-danger" role="alert">
                    {formError}
                  </p>
                ) : null}

                <FormField
                  control={form.control}
                  name="customer_name"
                  rules={{ required: 'Name is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} autoComplete="name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customer_email"
                  rules={{
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email address',
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" autoComplete="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customer_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (optional)</FormLabel>
                      <FormControl>
                        <Input {...field} type="tel" autoComplete="tel" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={createOrder.isPending}>
                  Place order
                </Button>
              </form>
            </Form>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
