import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ApiError } from '@event-platform/api-client/core';
import { AuthProvider, MemorySessionStorage } from '@event-platform/auth';
import type { Session } from '@event-platform/auth';
import { ScanPage } from './ScanPage';
import { useCheckInMutation } from '@/lib/tickets.query';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/lib/tickets.query', () => ({
  useCheckInMutation: vi.fn(),
}));

vi.mock('@/components/scanner/QrCameraScanner', () => ({
  QrCameraScanner: ({
    onDecode,
    paused,
  }: {
    onDecode: (token: string) => void;
    paused?: boolean;
  }) => (
    <button
      type="button"
      disabled={paused}
      onClick={() => onDecode('11111111-1111-1111-1111-111111111111')}
    >
      Simulate scan
    </button>
  ),
}));

const SESSION: Session = {
  accessToken: 'token-1',
  user: {
    id: '1',
    name: 'Scanner User',
    email: 'scanner@venue.com',
    permissions: ['checkin.perform'],
  },
};

function renderScanPage() {
  const storage = new MemorySessionStorage();
  storage.set(SESSION);

  return render(
    <MemoryRouter>
      <AuthProvider storage={storage}>
        <ScanPage />
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('ScanPage', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('shows a green success result after a valid check-in', async () => {
    const mutateAsync = vi.fn().mockResolvedValue({
      valid: true,
      ticket_number: 'EV000001-260801-000001',
      holder_name: 'Jane Doe',
      event_name: 'Summer Fest',
      status: 'checked_in',
    });

    vi.mocked(useCheckInMutation).mockReturnValue({
      mutateAsync,
      reset: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useCheckInMutation>);

    renderScanPage();

    fireEvent.click(screen.getByRole('button', { name: 'Simulate scan' }));

    await waitFor(() => {
      expect(screen.getByText('Checked in')).toBeTruthy();
    });

    expect(mutateAsync).toHaveBeenCalledWith({
      qr_token: '11111111-1111-1111-1111-111111111111',
    });
    expect(screen.getByText('Jane Doe')).toBeTruthy();
    expect(screen.getByText('Summer Fest')).toBeTruthy();
    expect(screen.getByText('EV000001-260801-000001')).toBeTruthy();
  });

  it('shows Ticket not found for 404 responses', async () => {
    vi.mocked(useCheckInMutation).mockReturnValue({
      mutateAsync: vi
        .fn()
        .mockRejectedValue(
          new ApiError('Ticket not found for the provided QR token.', { status: 404 }),
        ),
      reset: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useCheckInMutation>);

    renderScanPage();
    fireEvent.click(screen.getByRole('button', { name: 'Simulate scan' }));

    await waitFor(() => {
      expect(screen.getByText('Ticket not found.')).toBeTruthy();
    });
  });

  it('shows the backend 422 message for already checked in tickets', async () => {
    vi.mocked(useCheckInMutation).mockReturnValue({
      mutateAsync: vi
        .fn()
        .mockRejectedValue(new ApiError('Ticket has already been checked in.', { status: 422 })),
      reset: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useCheckInMutation>);

    renderScanPage();
    fireEvent.click(screen.getByRole('button', { name: 'Simulate scan' }));

    await waitFor(() => {
      expect(screen.getByText('Ticket has already been checked in.')).toBeTruthy();
    });
  });

  it('returns to scanning mode when Scan next is pressed', async () => {
    const reset = vi.fn();

    vi.mocked(useCheckInMutation).mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({
        valid: true,
        ticket_number: 'EV000001-260801-000001',
        holder_name: 'Jane Doe',
        event_name: 'Summer Fest',
        status: 'checked_in',
      }),
      reset,
      isPending: false,
    } as unknown as ReturnType<typeof useCheckInMutation>);

    renderScanPage();
    fireEvent.click(screen.getByRole('button', { name: 'Simulate scan' }));

    await waitFor(() => {
      expect(screen.getByText('Checked in')).toBeTruthy();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Scan next' }));

    expect(screen.queryByText('Checked in')).toBeNull();
    expect(screen.getByRole('button', { name: 'Simulate scan' })).toBeTruthy();
    expect(reset).toHaveBeenCalled();
  });
});
