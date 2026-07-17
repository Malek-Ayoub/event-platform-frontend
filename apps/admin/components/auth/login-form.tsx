'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ApiAuthAdapter, ApiError } from '@event-platform/api-client/core';
import { usePublicApiClient } from '@event-platform/api-client/react';
import { useAuth } from '@event-platform/auth';
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
import { adminSessionStorage } from '@/lib/session-storage';

type LoginFormValues = {
  email: string;
  password: string;
};

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const publicClient = usePublicApiClient();
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ApiAuthAdapter requires both clients; loginPublic only uses publicClient.
  const authAdapter = useMemo(
    () =>
      new ApiAuthAdapter({
        sessionStorage: adminSessionStorage,
        publicClient,
        tenantClient: publicClient,
      }),
    [publicClient],
  );

  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    setIsSubmitting(true);

    try {
      const session = await authAdapter.loginPublic({
        email: values.email.trim(),
        password: values.password,
      });
      await login(session);
      router.push('/dashboard');
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          setFormError('Invalid email or password');
        } else if (error.status === 422) {
          setFormError(error.message || 'Invalid email or password');
        } else {
          setFormError(error.message || 'Unable to sign in. Please try again.');
        }
      } else {
        setFormError('Unable to sign in. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Form {...form}>
      <form className="mx-auto max-w-sm space-y-4" onSubmit={onSubmit} noValidate>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="text-sm text-muted-foreground">Platform admin access.</p>
        </div>

        {formError ? (
          <p className="text-sm text-danger" role="alert">
            {formError}
          </p>
        ) : null}

        <FormField
          control={form.control}
          name="email"
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
          name="password"
          rules={{ required: 'Password is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" autoComplete="current-password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          Sign in
        </Button>
      </form>
    </Form>
  );
}
