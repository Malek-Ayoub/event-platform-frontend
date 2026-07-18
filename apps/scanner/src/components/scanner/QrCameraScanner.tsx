import { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import QrScannerWorkerPath from 'qr-scanner/qr-scanner-worker.min.js?url';

QrScanner.WORKER_PATH = QrScannerWorkerPath;

export type QrCameraScannerProps = {
  onDecode: (qrToken: string) => void;
  /** When true, pause accepting new scans (e.g. while check-in is in flight or result is shown). */
  paused?: boolean;
};

export function QrCameraScanner({ onDecode, paused = false }: QrCameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const onDecodeRef = useRef(onDecode);
  const pausedRef = useRef(paused);
  const [cameraError, setCameraError] = useState<string | null>(null);

  onDecodeRef.current = onDecode;
  pausedRef.current = paused;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    let cancelled = false;
    const scanner = new QrScanner(
      video,
      (result) => {
        if (pausedRef.current) {
          return;
        }

        const token = typeof result === 'string' ? result : result.data;
        if (token) {
          onDecodeRef.current(token);
        }
      },
      {
        returnDetailedScanResult: true,
        preferredCamera: 'environment',
        highlightScanRegion: true,
        highlightCodeOutline: true,
      },
    );

    scannerRef.current = scanner;

    void scanner
      .start()
      .then(() => {
        if (cancelled) {
          return;
        }
        setCameraError(null);
        if (pausedRef.current) {
          void scanner.pause(true);
        }
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }

        const name =
          error && typeof error === 'object' && 'name' in error
            ? String((error as { name: string }).name)
            : '';

        if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
          setCameraError('Camera access is required to scan tickets');
          return;
        }

        setCameraError('Unable to start the camera. Please try again.');
      });

    return () => {
      cancelled = true;
      scanner.destroy();
      scannerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const scanner = scannerRef.current;
    if (!scanner) {
      return;
    }

    if (paused) {
      void scanner.pause(true);
      return;
    }

    void scanner.start().catch(() => {
      // Camera errors are handled by the mount effect / permission state.
    });
  }, [paused]);

  if (cameraError) {
    return (
      <div
        className="flex min-h-64 items-center justify-center rounded-xl border border-border bg-surface p-6 text-center"
        role="alert"
      >
        <p className="text-base font-medium text-danger">{cameraError}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-black">
      <video ref={videoRef} className="aspect-[3/4] w-full object-cover" muted playsInline />
    </div>
  );
}
