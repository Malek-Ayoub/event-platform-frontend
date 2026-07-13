export function truncate(value: string, maxLength: number, suffix = '…'): string {
  if (maxLength <= 0) {
    return '';
  }

  if (value.length <= maxLength) {
    return value;
  }

  if (suffix.length >= maxLength) {
    return suffix.slice(0, maxLength);
  }

  return `${value.slice(0, maxLength - suffix.length)}${suffix}`;
}

export function capitalize(value: string): string {
  if (value.length === 0) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function toKebabCase(value: string): string {
  return value
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

export function isBlank(value: string | null | undefined): boolean {
  return value === null || value === undefined || value.trim().length === 0;
}

export function normalizeWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}
