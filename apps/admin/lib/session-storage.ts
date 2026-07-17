import { LocalStorageSessionStorage } from '@event-platform/auth';

export const ADMIN_SESSION_STORAGE_KEY = 'event-platform.admin.session';

export const adminSessionStorage = new LocalStorageSessionStorage(ADMIN_SESSION_STORAGE_KEY);
