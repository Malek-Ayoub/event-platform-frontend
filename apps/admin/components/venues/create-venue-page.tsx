'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { ApiError } from '@event-platform/api-client/core';
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@event-platform/ui';
import { Container, ErrorState, Section } from '@event-platform/ui/layout';
import {
  useCreateVenueMutation,
  type CreateVenueRequest,
  type VenueResource,
} from '@/components/venues/venues.query';

type CreateVenueFormValues = {
  name: string;
  subdomain: string;
  owner_name: string;
  owner_email: string;
  owner_password: string;
};

const EMPTY_VALUES: CreateVenueFormValues = {
  name: '',
  subdomain: '',
  owner_name: '',
  owner_email: '',
  owner_password: '',
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

  return error.message || 'Unable to create venue. Please try again.';
}

function VenueCreatedConfirmation({
  venue,
  onCreateAnother,
}: {
  venue: VenueResource;
  onCreateAnother: () => void;
}) {
  const subdomainHost = venue.subdomain
    ? `${venue.subdomain}.yourdomain.com`
    : 'subdomain.yourdomain.com';

  return (
    <div className="mx-auto max-w-lg space-y-6" data-slot="venue-created-confirmation">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Venue created</h1>
        <p className="text-sm text-muted-foreground">
          The venue is active. Share these details with the organizer.
        </p>
      </div>

      <dl className="space-y-3 text-sm">
        <div className="space-y-1">
          <dt className="text-muted-foreground">Venue name</dt>
          <dd className="font-medium">{venue.name ?? '—'}</dd>
        </div>
        <div className="space-y-1">
          <dt className="text-muted-foreground">Organizer subdomain</dt>
          <dd className="font-medium font-mono">{subdomainHost}</dd>
        </div>
        <div className="space-y-1">
          <dt className="text-muted-foreground">Owner email</dt>
          <dd className="font-medium">{venue.owner?.email ?? '—'}</dd>
        </div>
      </dl>

      <p className="text-sm text-muted-foreground">
        The owner can sign in now with the email and password you entered. No email verification
        step is required for this admin-provisioned account.
      </p>

      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={onCreateAnother}>
          Create another venue
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}

export function CreateVenuePage() {
  const createVenue = useCreateVenueMutation();
  const [formError, setFormError] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState(false);
  const [createdVenue, setCreatedVenue] = useState<VenueResource | null>(null);

  const form = useForm<CreateVenueFormValues>({
    defaultValues: EMPTY_VALUES,
  });

  const resetToForm = () => {
    setCreatedVenue(null);
    setFormError(null);
    setForbidden(false);
    form.reset(EMPTY_VALUES);
    createVenue.reset();
  };

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    setForbidden(false);

    const body: CreateVenueRequest = {
      name: values.name.trim(),
      subdomain: values.subdomain.trim().toLowerCase(),
      owner_name: values.owner_name.trim(),
      owner_email: values.owner_email.trim(),
      owner_password: values.owner_password,
    };

    try {
      const venue = await createVenue.mutateAsync(body);
      setCreatedVenue(venue);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 403) {
          setForbidden(true);
          return;
        }

        if (error.status === 422) {
          setFormError(formatVenueErrorMessage(error));
          return;
        }

        setFormError(formatVenueErrorMessage(error));
        return;
      }

      setFormError('Unable to create venue. Please try again.');
    }
  });

  return (
    <Section spacing="lg" variant="muted" aria-label="Create venue">
      <Container>
        {forbidden ? (
          <ErrorState
            title="Super Admin access required"
            description="Only Super Admin accounts can create venues."
          />
        ) : null}

        {!forbidden && createdVenue ? (
          <VenueCreatedConfirmation venue={createdVenue} onCreateAnother={resetToForm} />
        ) : null}

        {!forbidden && !createdVenue ? (
          <Form {...form}>
            <form className="mx-auto max-w-lg space-y-4" onSubmit={onSubmit} noValidate>
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">Create venue</h1>
                <p className="text-sm text-muted-foreground">
                  Provision a venue and its owner account.
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
                name="subdomain"
                rules={{
                  required: 'Subdomain is required',
                  pattern: {
                    value: /^[a-z0-9-]+$/,
                    message: 'Use lowercase letters, numbers, and hyphens only',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subdomain</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        autoComplete="off"
                        spellCheck={false}
                        onChange={(event) => {
                          field.onChange(event.target.value.toLowerCase());
                        }}
                      />
                    </FormControl>
                    <FormDescription>Will be used as subdomain.yourdomain.com</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="owner_name"
                rules={{ required: 'Owner name is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner name</FormLabel>
                    <FormControl>
                      <Input {...field} autoComplete="name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="owner_email"
                rules={{
                  required: 'Owner email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email address',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" autoComplete="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="owner_password"
                rules={{
                  required: 'Owner password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" autoComplete="new-password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={createVenue.isPending} className="w-full">
                {createVenue.isPending ? 'Creating…' : 'Create venue'}
              </Button>
            </form>
          </Form>
        ) : null}
      </Container>
    </Section>
  );
}
