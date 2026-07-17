import { LocalStorageSessionStorage } from '@event-platform/auth';

export const SCANNER_SESSION_STORAGE_KEY = 'event-platform.scanner.session';

export const scannerSessionStorage = new LocalStorageSessionStorage(SCANNER_SESSION_STORAGE_KEY);
