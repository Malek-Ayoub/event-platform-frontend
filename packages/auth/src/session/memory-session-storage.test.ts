import { describe, expect, it } from 'vitest';
import { MemorySessionStorage } from './memory-session-storage.js';
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

describe('MemorySessionStorage', () => {
  it('stores and retrieves a session', () => {
    const storage = new MemorySessionStorage();

    expect(storage.get()).toBeNull();

    storage.set(session);

    expect(storage.get()).toEqual(session);
  });

  it('clears the stored session', () => {
    const storage = new MemorySessionStorage();
    storage.set(session);

    storage.clear();

    expect(storage.get()).toBeNull();
  });
});
