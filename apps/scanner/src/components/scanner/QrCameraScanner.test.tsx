import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { QrCameraScanner } from './QrCameraScanner';

const startMock = vi.fn();
const pauseMock = vi.fn();
const destroyMock = vi.fn();

vi.mock('qr-scanner', () => {
  class MockQrScanner {
    static WORKER_PATH = '';

    constructor(
      _video: HTMLVideoElement,
      _onDecode: (result: string | { data: string }) => void,
      _options?: unknown,
    ) {}

    start = startMock;
    pause = pauseMock;
    destroy = destroyMock;
  }

  return { default: MockQrScanner };
});

vi.mock('qr-scanner/qr-scanner-worker.min.js?url', () => ({
  default: '/mock-qr-worker.js',
}));

describe('QrCameraScanner', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('shows a clear message when camera permission is denied', async () => {
    const error = new Error('Permission denied');
    error.name = 'NotAllowedError';
    startMock.mockRejectedValue(error);

    render(<QrCameraScanner onDecode={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toBe(
        'Camera access is required to scan tickets',
      );
    });
  });

  it('destroys the scanner on unmount', async () => {
    startMock.mockResolvedValue(undefined);

    const { unmount } = render(<QrCameraScanner onDecode={vi.fn()} />);

    await waitFor(() => {
      expect(startMock).toHaveBeenCalled();
    });

    unmount();
    expect(destroyMock).toHaveBeenCalledTimes(1);
  });
});
