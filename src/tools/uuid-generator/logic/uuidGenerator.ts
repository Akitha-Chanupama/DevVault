import { UuidOptions } from '../types';

export function formatUuid(uuid: string, options: Pick<UuidOptions, 'uppercase' | 'hyphens'>): string {
  let result = uuid;
  if (!options.hyphens) {
    result = result.replace(/-/g, '');
  }
  if (options.uppercase) {
    result = result.toUpperCase();
  } else {
    result = result.toLowerCase();
  }
  return result;
}

export function generateUuids(options: UuidOptions): string[] {
  const count = Math.max(1, Math.min(500, options.count));
  const list: string[] = [];

  for (let i = 0; i < count; i++) {
    const raw = crypto.randomUUID();
    list.push(formatUuid(raw, { uppercase: options.uppercase, hyphens: options.hyphens }));
  }

  return list;
}

