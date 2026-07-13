import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { MemorySessionStorage } from '../session/memory-session-storage.js';
import type { SessionStorageAdapter } from '../session/session-storage-adapter.js';
import type { Session } from '../types/session.js';
import type { User } from '../types/user.js';
import { AuthContext } from './auth-context.js';
import type { AuthContextValue } from './auth-types.js';

export type AuthProviderProps = {
  children: ReactNode;
  storage?: SessionStorageAdapter;
  initialSession?: Session | null;
};

function readSession(
  storage: SessionStorageAdapter,
  initialSession?: Session | null,
): Session | null {
  if (initialSession !== undefined) {
    return initialSession;
  }

  return storage.get();
}

export function AuthProvider({
  children,
  storage: storageProp,
  initialSession,
}: AuthProviderProps) {
  const storage = useMemo(() => storageProp ?? new MemorySessionStorage(), [storageProp]);

  const [session, setSession] = useState<Session | null>(() =>
    readSession(storage, initialSession),
  );
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(
    async (nextSession: Session) => {
      setIsLoading(true);
      storage.set(nextSession);
      setSession(nextSession);
      setIsLoading(false);
    },
    [storage],
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    storage.clear();
    setSession(null);
    setIsLoading(false);
  }, [storage]);

  const updateUser = useCallback(
    (patch: Partial<User>) => {
      setSession((current) => {
        if (!current) {
          return current;
        }

        const nextSession: Session = {
          ...current,
          user: {
            ...current.user,
            ...patch,
          },
        };

        storage.set(nextSession);
        return nextSession;
      });
    },
    [storage],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      accessToken: session?.accessToken ?? null,
      isAuthenticated: session !== null,
      isLoading,
      login,
      logout,
      updateUser,
    }),
    [session, isLoading, login, logout, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
