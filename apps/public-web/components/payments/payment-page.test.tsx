import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@event-platform/api-client/core';
import { PaymentPage } from './payment-page';
import {
  useRequestPaymentInstructionsMutation,
  useSubmitPaymentVerificationMutation,
} from '@/components/payments/payments.query';

vi.mock('@/components/payments/payments.query', () => ({
  useRequestPaymentInstructionsMutation: vi.fn(),
  useSubmitPaymentVerificationMutation: vi.fn(),
}));

const MOCK_INSTRUCTIONS = {
  provider: 'shamcash',
  merchant_account: 'WALLET-001',
  amount: '120.00',
  currency: 'USD',
  expires_at: '2026-08-15T21:00:00.000Z',
  instructions: 'Transfer the amount to the merchant account and keep your reference.',
};

function mockInstructionsMutation(mutateAsync: ReturnType<typeof vi.fn>) {
  vi.mocked(useRequestPaymentInstructionsMutation).mockReturnValue({
    mutateAsync,
    isPending: false,
  } as unknown as ReturnType<typeof useRequestPaymentInstructionsMutation>);
}

function mockVerificationMutation(mutateAsync: ReturnType<typeof vi.fn>) {
  vi.mocked(useSubmitPaymentVerificationMutation).mockReturnValue({
    mutateAsync,
    isPending: false,
  } as unknown as ReturnType<typeof useSubmitPaymentVerificationMutation>);
}

describe('PaymentPage', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('loads and displays payment instructions', async () => {
    mockInstructionsMutation(vi.fn().mockResolvedValue(MOCK_INSTRUCTIONS));
    mockVerificationMutation(vi.fn());

    render(<PaymentPage orderNumber="ORD-ABC12345" />);

    await waitFor(() => {
      expect(screen.getByText('WALLET-001')).toBeTruthy();
    });

    expect(screen.getByText('$120.00')).toBeTruthy();
    expect(
      screen.getByText('Transfer the amount to the merchant account and keep your reference.'),
    ).toBeTruthy();
    expect(screen.getByText(/shamcash/i)).toBeTruthy();
  });

  it('shows ErrorState when instructions request returns 404', async () => {
    mockInstructionsMutation(vi.fn().mockRejectedValue(new ApiError('Not found', { status: 404 })));
    mockVerificationMutation(vi.fn());

    render(<PaymentPage orderNumber="ORD-MISSING" />);

    await waitFor(() => {
      expect(screen.getByText('Order not found or already paid')).toBeTruthy();
    });

    expect(screen.getByRole('link', { name: 'Back to events' }).getAttribute('href')).toBe(
      '/events',
    );
  });

  it('shows payment confirmed and hides the form when status is paid', async () => {
    mockInstructionsMutation(vi.fn().mockResolvedValue(MOCK_INSTRUCTIONS));
    mockVerificationMutation(
      vi.fn().mockResolvedValue({
        status: 'paid',
        message: 'Payment confirmed.',
      }),
    );

    render(<PaymentPage orderNumber="ORD-ABC12345" />);

    await waitFor(() => {
      expect(screen.getByLabelText('Transaction number')).toBeTruthy();
    });

    fireEvent.change(screen.getByLabelText('Transaction number'), {
      target: { value: 'TX-1001' },
    });
    fireEvent.click(screen.getByRole('button', { name: /confirm payment/i }));

    await waitFor(() => {
      expect(screen.getByText('Payment confirmed')).toBeTruthy();
      expect(screen.getByText('Payment confirmed.')).toBeTruthy();
    });

    expect(screen.queryByLabelText('Transaction number')).toBeNull();
    expect(screen.getByText(/ticket will be sent to your email/i)).toBeTruthy();
  });

  it('keeps the form open when status is failed', async () => {
    mockInstructionsMutation(vi.fn().mockResolvedValue(MOCK_INSTRUCTIONS));
    mockVerificationMutation(
      vi.fn().mockResolvedValue({
        status: 'failed',
        message: 'Payment verification failed.',
      }),
    );

    render(<PaymentPage orderNumber="ORD-ABC12345" />);

    await waitFor(() => {
      expect(screen.getByLabelText('Transaction number')).toBeTruthy();
    });

    fireEvent.change(screen.getByLabelText('Transaction number'), {
      target: { value: 'TX-BAD' },
    });
    fireEvent.click(screen.getByRole('button', { name: /confirm payment/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toBe('Payment verification failed.');
    });

    expect(screen.getByLabelText('Transaction number')).toBeTruthy();
    expect(screen.getByRole('button', { name: /confirm payment/i })).toBeTruthy();
  });

  it('shows a dedicated message for 429 on verification submit', async () => {
    mockInstructionsMutation(vi.fn().mockResolvedValue(MOCK_INSTRUCTIONS));
    mockVerificationMutation(
      vi.fn().mockRejectedValue(new ApiError('Too Many Attempts.', { status: 429 })),
    );

    render(<PaymentPage orderNumber="ORD-ABC12345" />);

    await waitFor(() => {
      expect(screen.getByLabelText('Transaction number')).toBeTruthy();
    });

    fireEvent.change(screen.getByLabelText('Transaction number'), {
      target: { value: 'TX-1001' },
    });
    fireEvent.click(screen.getByRole('button', { name: /confirm payment/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toBe(
        'too many attempts, try again in a minute',
      );
    });
  });
});
