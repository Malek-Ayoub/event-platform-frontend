'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
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
import { formatCurrency, formatDateTime } from '@event-platform/shared';
import {
  useRequestPaymentInstructionsMutation,
  useSubmitPaymentVerificationMutation,
  type PublicPaymentInstructionResource,
} from '@/components/payments/payments.query';

type TransactionFormValues = {
  transaction_number: string;
};

type VerificationView =
  | { kind: 'paid'; message: string }
  | { kind: 'failed'; message: string }
  | { kind: 'verifying'; message: string; transactionNumber: string }
  | { kind: 'other'; message: string; transactionNumber: string };

export function PaymentPage({ orderNumber }: { orderNumber: string }) {
  const { mutateAsync: requestInstructionsAsync, isPending: isRequestingInstructions } =
    useRequestPaymentInstructionsMutation(orderNumber);
  const { mutateAsync: submitVerificationAsync, isPending: isSubmittingVerification } =
    useSubmitPaymentVerificationMutation(orderNumber);

  const [instructions, setInstructions] = useState<PublicPaymentInstructionResource | null>(null);
  const [isLoadingInstructions, setIsLoadingInstructions] = useState(true);
  const [loadError, setLoadError] = useState<'404' | 'generic' | null>(null);
  const [instructionsExpired, setInstructionsExpired] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [verification, setVerification] = useState<VerificationView | null>(null);

  const form = useForm<TransactionFormValues>({
    defaultValues: {
      transaction_number: '',
    },
  });

  const loadInstructions = useCallback(async () => {
    setIsLoadingInstructions(true);
    setLoadError(null);
    setInstructionsExpired(false);
    setFormError(null);
    setVerification(null);

    try {
      const data = await requestInstructionsAsync();
      setInstructions(data);
    } catch (error) {
      setInstructions(null);
      if (error instanceof ApiError && error.status === 404) {
        setLoadError('404');
      } else {
        setLoadError('generic');
      }
    } finally {
      setIsLoadingInstructions(false);
    }
  }, [requestInstructionsAsync]);

  useEffect(() => {
    void loadInstructions();
  }, [loadInstructions]);

  const runVerification = async (transactionNumber: string) => {
    setFormError(null);
    setInstructionsExpired(false);

    try {
      const result = await submitVerificationAsync({
        transaction_number: transactionNumber,
      });

      if (result.status === 'paid') {
        setVerification({ kind: 'paid', message: result.message });
        return;
      }

      if (result.status === 'failed') {
        setVerification({ kind: 'failed', message: result.message });
        return;
      }

      if (result.status === 'verifying') {
        setVerification({
          kind: 'verifying',
          message: result.message,
          transactionNumber,
        });
        return;
      }

      setVerification({
        kind: 'other',
        message: result.message,
        transactionNumber,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 404) {
          setInstructionsExpired(true);
          return;
        }

        if (error.status === 429) {
          setFormError('too many attempts, try again in a minute');
          return;
        }
      }

      setFormError('Unable to verify payment. Please try again.');
    }
  };

  const onSubmit = form.handleSubmit(async (values) => {
    await runVerification(values.transaction_number.trim());
  });

  const showForm =
    !isLoadingInstructions &&
    !loadError &&
    instructions &&
    !instructionsExpired &&
    verification?.kind !== 'paid';

  return (
    <Section spacing="lg" variant="muted" aria-label="Payment">
      <Container className="space-y-6">
        {isLoadingInstructions ? (
          <LoadingState
            title="Loading payment instructions"
            description="Preparing transfer details."
          />
        ) : null}

        {!isLoadingInstructions && loadError === '404' ? (
          <ErrorState
            title="Order not found or already paid"
            description="We could not find an order that still needs payment."
            action={
              <Button asChild>
                <Link href="/events">Back to events</Link>
              </Button>
            }
          />
        ) : null}

        {!isLoadingInstructions && loadError === 'generic' ? (
          <ErrorState
            title="Unable to load payment instructions"
            description="We could not load payment instructions right now. Please try again."
            action={
              <Button
                type="button"
                disabled={isRequestingInstructions}
                onClick={() => void loadInstructions()}
              >
                Retry
              </Button>
            }
          />
        ) : null}

        {!isLoadingInstructions && instructionsExpired ? (
          <ErrorState
            title="Payment instructions expired"
            description="There are no active payment instructions for this order. Request a new set to continue."
            action={
              <Button
                type="button"
                disabled={isRequestingInstructions}
                onClick={() => void loadInstructions()}
              >
                Request new instructions
              </Button>
            }
          />
        ) : null}

        {!isLoadingInstructions &&
        !loadError &&
        !instructionsExpired &&
        verification?.kind === 'paid' ? (
          <div className="space-y-3" data-slot="payment-confirmed">
            <h1 className="text-3xl font-semibold tracking-tight">Payment confirmed</h1>
            <p className="text-sm">{verification.message}</p>
            <p className="text-sm text-muted-foreground">
              Your ticket will be sent to your email shortly.
            </p>
          </div>
        ) : null}

        {showForm && instructions ? (
          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight">Complete payment</h1>
              <p className="text-sm text-muted-foreground">Order {orderNumber}</p>
            </div>

            <div className="space-y-3 text-sm" data-slot="payment-instructions">
              <p>
                Provider: <span className="font-medium">{instructions.provider}</span>
              </p>
              <p>
                Merchant account:{' '}
                <span className="font-medium">{instructions.merchant_account}</span>
              </p>
              <p>
                Amount:{' '}
                <span className="font-medium">
                  {formatCurrency(Number(instructions.amount), instructions.currency)}
                </span>
              </p>
              <p className="whitespace-pre-wrap">{instructions.instructions}</p>
              <p className="text-muted-foreground">
                Expires: {formatDateTime(instructions.expires_at)}
              </p>
            </div>

            <Form {...form}>
              <form className="space-y-4" onSubmit={onSubmit} noValidate>
                {formError ? (
                  <p className="text-sm text-danger" role="alert">
                    {formError}
                  </p>
                ) : null}

                {verification?.kind === 'failed' ? (
                  <p className="text-sm text-danger" role="alert">
                    {verification.message}
                  </p>
                ) : null}

                {verification?.kind === 'verifying' ? (
                  <div className="space-y-3">
                    <p className="text-sm" role="status">
                      {verification.message}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isSubmittingVerification}
                      onClick={() => void runVerification(verification.transactionNumber)}
                    >
                      Check again
                    </Button>
                  </div>
                ) : null}

                {verification?.kind === 'other' ? (
                  <div className="space-y-3">
                    <p className="text-sm" role="status">
                      {verification.message}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isSubmittingVerification}
                      onClick={() => void runVerification(verification.transactionNumber)}
                    >
                      Try again
                    </Button>
                  </div>
                ) : null}

                <FormField
                  control={form.control}
                  name="transaction_number"
                  rules={{ required: 'Transaction number is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transaction number</FormLabel>
                      <FormControl>
                        <Input {...field} autoComplete="off" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isSubmittingVerification}>
                  I&apos;ve transferred — confirm payment
                </Button>
              </form>
            </Form>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
