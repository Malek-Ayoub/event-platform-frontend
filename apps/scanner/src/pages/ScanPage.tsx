import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiError } from '@event-platform/api-client/core';
import { useAuth } from '@event-platform/auth';
import { Button } from '@event-platform/ui';
import { Container, Section } from '@event-platform/ui/layout';
import { QrCameraScanner } from '@/components/scanner/QrCameraScanner';
import { useCheckInMutation, type TicketCheckInResult } from '@/lib/tickets.query';

type ScanResultView =
  | { kind: 'success'; data: TicketCheckInResult }
  | { kind: 'not_found' }
  | { kind: 'already_checked_in'; message: string }
  | { kind: 'rejected'; message: string }
  | { kind: 'error'; message: string };

function ResultPanel({ result, onScanNext }: { result: ScanResultView; onScanNext: () => void }) {
  const isSuccess = result.kind === 'success';
  const isAlreadyCheckedIn = result.kind === 'already_checked_in';

  const panelClass = isSuccess
    ? 'bg-success text-success-foreground'
    : isAlreadyCheckedIn
      ? 'bg-warning text-warning-foreground'
      : 'bg-danger text-danger-foreground';

  return (
    <div
      className={`flex min-h-[70vh] flex-col items-center justify-center gap-6 rounded-xl p-8 text-center ${panelClass}`}
      data-slot="scan-result"
    >
      {isSuccess ? (
        <>
          <p className="text-3xl font-bold tracking-tight sm:text-4xl">Checked in</p>
          <div className="space-y-2 text-lg sm:text-xl">
            <p className="font-semibold">{result.data.holder_name}</p>
            <p>{result.data.event_name}</p>
            <p className="opacity-90">{result.data.ticket_number}</p>
          </div>
        </>
      ) : null}

      {result.kind === 'not_found' ? (
        <p className="text-3xl font-bold tracking-tight sm:text-4xl">Ticket not found.</p>
      ) : null}

      {result.kind === 'already_checked_in' || result.kind === 'rejected' ? (
        <p className="text-2xl font-bold tracking-tight sm:text-3xl">{result.message}</p>
      ) : null}

      {result.kind === 'error' ? (
        <p className="text-2xl font-bold tracking-tight sm:text-3xl">{result.message}</p>
      ) : null}

      <Button type="button" variant="secondary" size="lg" onClick={onScanNext}>
        Scan next
      </Button>
    </div>
  );
}

export function ScanPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const checkIn = useCheckInMutation();
  const [result, setResult] = useState<ScanResultView | null>(null);
  const [isHandlingScan, setIsHandlingScan] = useState(false);

  const cameraPaused = isHandlingScan || result !== null;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleScanNext = useCallback(() => {
    setResult(null);
    setIsHandlingScan(false);
    checkIn.reset();
  }, [checkIn]);

  const handleDecode = useCallback(
    async (qrToken: string) => {
      if (isHandlingScan || result !== null) {
        return;
      }

      setIsHandlingScan(true);

      try {
        const data = await checkIn.mutateAsync({ qr_token: qrToken });
        setResult({ kind: 'success', data });
      } catch (error) {
        if (error instanceof ApiError) {
          if (error.status === 404) {
            setResult({ kind: 'not_found' });
            return;
          }

          if (error.status === 422) {
            const message = error.message || 'Ticket is not eligible for check-in.';
            if (message === 'Ticket has already been checked in.') {
              setResult({ kind: 'already_checked_in', message });
            } else {
              setResult({ kind: 'rejected', message });
            }
            return;
          }

          setResult({
            kind: 'error',
            message: error.message || 'Unable to check in this ticket.',
          });
          return;
        }

        setResult({
          kind: 'error',
          message: 'Unable to check in this ticket.',
        });
      } finally {
        setIsHandlingScan(false);
      }
    },
    [checkIn, isHandlingScan, result],
  );

  return (
    <Section spacing="lg" variant="muted" aria-label="Scanner">
      <Container className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">Scanner</h1>
            {user ? (
              <div className="space-y-1 text-sm">
                <p>
                  Signed in as <span className="font-medium">{user.name}</span>
                </p>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            ) : null}
          </div>
          <Button type="button" variant="outline" onClick={() => void handleLogout()}>
            Logout
          </Button>
        </div>

        {result ? (
          <ResultPanel result={result} onScanNext={handleScanNext} />
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Point the camera at a ticket QR code to check in.
            </p>
            <QrCameraScanner onDecode={(token) => void handleDecode(token)} paused={cameraPaused} />
            {isHandlingScan ? (
              <p className="text-center text-sm text-muted-foreground" role="status">
                Checking ticket…
              </p>
            ) : null}
          </div>
        )}
      </Container>
    </Section>
  );
}
