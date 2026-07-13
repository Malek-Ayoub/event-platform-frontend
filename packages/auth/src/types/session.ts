import type { User } from './user.js';

/**
 * Opaque access token. JWT decoding is deferred to Sprint 0.3+.
 */
export type AccessToken = string;

export type Session = {
  user: User;
  accessToken: AccessToken;
};
