'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ApiError } from '@event-platform/api-client/core';
import { formatDateTime } from '@event-platform/shared';
import {
  Badge,
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
import {
  useActivateVenueMutation,
  useSuspendVenueMutation,
  useUpdateVenueMutation,
  useVenueQuery,
  type UpdateVenueRequest,
  type VenueStatus,
} from '@/components/venues/venues.query';

type UpdateVenueFormValues = {
  name: string;
  commission_rate: string;
};

function formatVenueErrorMessage(error: ApiError): string {
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

  return error.message || 'Unable to update venue. Please try again.';
}

function statusBadgeVariant(
  status: VenueStatus | undefined,
): 'success' | 'warning' | 'danger' | 'secondary' {
  if (status === 'active') return 'success';
  if (status === 'suspended') return 'danger';
  if (status === 'pending') return 'warning';
  return 'secondary';
}

export function VenueDetailPage({ venueId }: { venueId: number }) {
  const { data: venue, isLoading, isError, error, refetch } = useVenueQuery(venueId);
  const updateVenue = useUpdateVenueMutation(venueId);
  const suspendVenue = useSuspendVenueMutation(venueId);
  const activateVenue = useActivateVenueMutation(venueId);

  const [formError, setFormError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const form = useForm<UpdateVenueFormValues>({
    defaultValues: {
      name: '',
      commission_rate: '',
    },
  });

  useEffect(() => {
    if (!venue) {
      return;
    }

    form.reset({
      name: venue.name ?? '',
      commission_rate: venue.commission_rate ?? '',
    });
  }, [venue, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    setActionError(null);

    const body: UpdateVenueRequest = {
      name: values.name.trim(),
      commission_rate: Number(values.commission_rate),
    };

    try {
      await updateVenue.mutateAsync(body);
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(formatVenueErrorMessage(err));
        return;
      }

      setFormError('Unable to update venue. Please try again.');
    }
  });

  const handleSuspend = async () => {
    setActionError(null);
    setFormError(null);

    try {
      await suspendVenue.mutateAsync();
    } catch (err) {
      if (err instanceof ApiError) {
        setActionError(err.message || 'Unable to suspend venue.');
        return;
      }

      setActionError('Unable to suspend venue. Please try again.');
    }
  };

  const handleActivate = async () => {
    setActionError(null);
    setFormError(null);

    try {
      await activateVenue.mutateAsync();
    } catch (err) {
      if (err instanceof ApiError) {
        setActionError(err.message || 'Unable to activate venue.');
        return;
      }

      setActionError('Unable to activate venue. Please try again.');
    }
  };

  const actionPending = suspendVenue.isPending || activateVenue.isPending;

  return (
    <Section spacing="lg" variant="muted" aria-label="Venue detail">
      <Container className="space-y-8">
        <div className="space-y-1">
          <p className="text-sm">
            <Link href="/venues" className="text-muted-foreground hover:underline">
              ← Back to venues
            </Link>
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            {venue?.name ?? (isLoading ? 'Loading venue…' : 'Venue')}
          </h1>
        </div>

        {isLoading ? (
          <LoadingState title="Loading venue" description="Fetching venue details." />
        ) : null}

        {isError ? (
          error instanceof ApiError && error.status === 403 ? (
            <ErrorState
              title="Super Admin access required"
              description="Only Super Admin accounts can view venue details."
            />
          ) : error instanceof ApiError && error.status === 404 ? (
            <ErrorState
              title="Venue not found"
              description="This venue does not exist or was removed."
              action={
                <Button type="button" variant="outline" asChild>
                  <Link href="/venues">Back to venues</Link>
                </Button>
              }
            />
          ) : (
            <ErrorState
              title="Unable to load venue"
              description="We could not load this venue right now. Please try again."
              action={
                <Button type="button" onClick={() => void refetch()}>
                  Retry
                </Button>
              }
            />
          )
        ) : null}

        {!isLoading && !isError && venue ? (
          <div className="mx-auto grid max-w-2xl gap-8">
            <dl className="grid gap-4 text-sm sm:grid-cols-2" data-slot="venue-details">
              <div className="space-y-1">
                <dt className="text-muted-foreground">Name</dt>
                <dd className="font-medium">{venue.name ?? '—'}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-muted-foreground">Subdomain</dt>
                <dd className="font-medium font-mono">{venue.subdomain ?? '—'}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-muted-foreground">Status</dt>
                <dd>
                  {venue.status ? (
                    <Badge variant={statusBadgeVariant(venue.status)} data-slot="venue-status">
                      {venue.status}
                    </Badge>
                  ) : (
                    '—'
                  )}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-muted-foreground">Commission rate</dt>
                <dd className="font-medium">{venue.commission_rate ?? '—'}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-muted-foreground">Owner name</dt>
                <dd className="font-medium">{venue.owner?.name ?? '—'}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-muted-foreground">Owner email</dt>
                <dd className="font-medium">{venue.owner?.email ?? '—'}</dd>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <dt className="text-muted-foreground">Created at</dt>
                <dd className="font-medium">
                  {venue.created_at ? formatDateTime(venue.created_at) : '—'}
                </dd>
              </div>
            </dl>

            <div className="space-y-3">
              <h2 className="text-lg font-semibold tracking-tight">Status actions</h2>
              {actionError ? (
                <p className="text-sm text-danger" role="alert" data-slot="venue-action-error">
                  {actionError}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-2">
                {venue.status === 'active' ? (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={actionPending}
                    onClick={() => void handleSuspend()}
                  >
                    {suspendVenue.isPending ? 'Suspending…' : 'Suspend'}
                  </Button>
                ) : null}
                {venue.status === 'suspended' ? (
                  <Button
                    type="button"
                    disabled={actionPending}
                    onClick={() => void handleActivate()}
                  >
                    {activateVenue.isPending ? 'Activating…' : 'Activate'}
                  </Button>
                ) : null}
              </div>
            </div>

            <Form {...form}>
              <form
                className="space-y-4"
                onSubmit={onSubmit}
                noValidate
                data-slot="venue-edit-form"
              >
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold tracking-tight">Edit venue</h2>
                  <p className="text-sm text-muted-foreground">
                    Name and commission rate only. Subdomain cannot be changed here.
                  </p>
                </div>

                {formError ? (
                  <p className="text-sm text-danger" role="alert">
                    {formError}
                  </p>
                ) : null}

                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: 'Venue name is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Venue name</FormLabel>
                      <FormControl>
                        <Input {...field} autoComplete="organization" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="commission_rate"
                  rules={{
                    required: 'Commission rate is required',
                    validate: (value) => {
                      const parsed = Number(value);
                      if (!Number.isFinite(parsed)) {
                        return 'Enter a valid number';
                      }
                      if (parsed < 0 || parsed > 100) {
                        return 'Commission rate must be between 0 and 100';
                      }
                      return true;
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Commission rate</FormLabel>
                      <FormControl>
                        <Input {...field} inputMode="decimal" autoComplete="off" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={updateVenue.isPending}>
                  {updateVenue.isPending ? 'Saving…' : 'Save changes'}
                </Button>
              </form>
            </Form>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
