import type { Session } from '../types/session.js';
import type { SessionStorageAdapter } from './session-storage-adapter.js';

export const ORGANIZER_SESSION_STORAGE_KEY = 'event-platform.organizer.session';

export class LocalStorageSessionStorage implements SessionStorageAdapter {
  private readonly key: string;

  constructor(key: string = ORGANIZER_SESSION_STORAGE_KEY) {
    this.key = key;
  }

  get(): Session | null {
    const storage = this.getStorage();
    if (!storage) {
      return null;
    }

    const raw = storage.getItem(this.key);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as Session;
    } catch {
      return null;
    }
  }

  set(session: Session): void {
    const storage = this.getStorage();
    if (!storage) {
      return;
    }

    storage.setItem(this.key, JSON.stringify(session));
  }

  clear(): void {
    const storage = this.getStorage();
    if (!storage) {
      return;
    }

    storage.removeItem(this.key);
  }

  private getStorage(): Storage | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage;
  }
}
