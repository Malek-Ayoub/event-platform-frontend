import type { Session, SessionStorageAdapter } from '@event-platform/auth';
import type { User } from '@event-platform/auth';
import type { ApiClient } from '../client/factory.js';
import { UnauthorizedError } from '../errors/index.js';

type AuthUserResponse = {
  data?: {
    id?: string | number;
    name?: string;
    email?: string;
    permissions?: string[];
    is_super_admin?: boolean;
    role?: string;
  };
};

type LoginResponse = {
  data?: {
    token?: string;
    access_token?: string;
    user?: AuthUserResponse['data'];
  };
  token?: string;
  access_token?: string;
};

export type ApiAuthAdapterOptions = {
  sessionStorage: SessionStorageAdapter;
  publicClient: ApiClient;
  tenantClient: ApiClient;
};

export class ApiAuthAdapter {
  private readonly sessionStorage: SessionStorageAdapter;
  private readonly publicClient: ApiClient;
  private readonly tenantClient: ApiClient;

  constructor(options: ApiAuthAdapterOptions) {
    this.sessionStorage = options.sessionStorage;
    this.publicClient = options.publicClient;
    this.tenantClient = options.tenantClient;
  }

  async loginPublic(credentials: { email: string; password: string }): Promise<Session> {
    const response = await this.publicClient.post<LoginResponse>('/api/auth/login', credentials);
    return this.toSession(response);
  }

  async loginTenant(credentials: { email: string; password: string }): Promise<Session> {
    const response = await this.tenantClient.post<LoginResponse>(
      '/api/tenant/auth/login',
      credentials,
    );
    return this.toSession(response);
  }

  async fetchPublicUser(): Promise<User> {
    const response = await this.publicClient.get<AuthUserResponse>('/api/auth/user');
    return this.toUser(response.data);
  }

  async fetchTenantUser(): Promise<User> {
    const response = await this.tenantClient.get<AuthUserResponse>('/api/tenant/auth/user');
    return this.toUser(response.data);
  }

  async logoutPublic(): Promise<void> {
    await this.publicClient.post('/api/auth/logout');
    this.sessionStorage.clear();
  }

  async logoutTenant(): Promise<void> {
    await this.tenantClient.post('/api/tenant/auth/logout');
    this.sessionStorage.clear();
  }

  private toSession(response: LoginResponse): Session {
    const payload = response.data;
    const token =
      payload?.token ?? payload?.access_token ?? response.token ?? response.access_token;
    const userPayload = payload && 'user' in payload ? payload.user : payload;

    if (!token || !userPayload || typeof userPayload !== 'object') {
      throw new UnauthorizedError('Login response did not include a token or user.');
    }

    const session: Session = {
      accessToken: token,
      user: this.toUser(userPayload as AuthUserResponse['data']),
    };

    this.sessionStorage.set(session);
    return session;
  }

  private toUser(payload: AuthUserResponse['data'] | undefined): User {
    if (!payload?.id || !payload.email || !payload.name) {
      throw new UnauthorizedError('User response was incomplete.');
    }

    return {
      id: String(payload.id),
      name: payload.name,
      email: payload.email,
      permissions: payload.permissions ?? [],
      isSuperAdmin: payload.is_super_admin ?? false,
      role: payload.role,
    };
  }
}
