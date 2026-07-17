/** @vitest-environment jsdom */

import { afterEach, describe, expect, it } from 'vitest';
import {
  LocalStorageSessionStorage,
  ORGANIZER_SESSION_STORAGE_KEY,
} from './local-storage-session-storage.js';
import type { Session } from '../types/session.js';

const session: Session = {
  user: {
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
    permissions: ['reports.view'],
  },
  accessToken: 'opaque-token',
};

describe('LocalStorageSessionStorage', () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it('stores and retrieves a session from localStorage', () => {
    const storage = new LocalStorageSessionStorage();

    expect(storage.get()).toBeNull();

    storage.set(session);

    expect(storage.get()).toEqual(session);
    expect(window.localStorage.getItem(ORGANIZER_SESSION_STORAGE_KEY)).toBeTruthy();
  });

  it('clears the stored session', () => {
    const storage = new LocalStorageSessionStorage();
    storage.set(session);

    storage.clear();

    expect(storage.get()).toBeNull();
    expect(window.localStorage.getItem(ORGANIZER_SESSION_STORAGE_KEY)).toBeNull();
  });

  it('returns null for invalid JSON', () => {
    window.localStorage.setItem(ORGANIZER_SESSION_STORAGE_KEY, '{not-json');

    const storage = new LocalStorageSessionStorage();

    expect(storage.get()).toBeNull();
  });
});
