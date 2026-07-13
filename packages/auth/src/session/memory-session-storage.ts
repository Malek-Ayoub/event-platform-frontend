import type { Session } from '../types/session.js';
import type { SessionStorageAdapter } from './session-storage-adapter.js';

export class MemorySessionStorage implements SessionStorageAdapter {
  private session: Session | null = null;

  get(): Session | null {
    return this.session;
  }

  set(session: Session): void {
    this.session = session;
  }

  clear(): void {
    this.session = null;
  }
}
