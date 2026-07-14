import type { ApiClient } from '../client/factory.js';
import {
  ApiClientsAlreadyInitializedError,
  ApiClientsNotInitializedError,
} from '../errors/index.js';

export type RegisteredApiClients = {
  public: ApiClient;
  tenant: ApiClient;
  admin: ApiClient;
};

let initialized = false;
let clients: RegisteredApiClients | null = null;

export function registerApiClients(next: RegisteredApiClients): void {
  if (initialized) {
    throw new ApiClientsAlreadyInitializedError();
  }

  clients = next;
  initialized = true;
}

export function getRegisteredApiClients(): RegisteredApiClients {
  if (!clients) {
    throw new ApiClientsNotInitializedError();
  }

  return clients;
}

/** @internal Test helper only. */
export function resetApiClients(): void {
  initialized = false;
  clients = null;
}

export function isApiClientsInitialized(): boolean {
  return initialized;
}
