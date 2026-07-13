import type { Session } from '../types/session.js';

export interface SessionStorageAdapter {
  get(): Session | null;
  set(session: Session): void;
  clear(): void;
}
