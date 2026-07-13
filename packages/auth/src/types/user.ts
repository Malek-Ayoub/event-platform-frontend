import type { Permission } from './permission.js';
import type { Role } from './role.js';

export type User = {
  id: string;
  name: string;
  email: string;
  role?: Role;
  permissions: Permission[];
  isSuperAdmin?: boolean;
};
