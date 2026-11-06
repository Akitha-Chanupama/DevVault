import type { FieldDataType, RandomJsonOptions } from '../types';

const FIRST_NAMES = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Sam', 'Riley', 'Jamie', 'Quinn', 'Avery', 'Devon', 'Jesse'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Wilson', 'Anderson', 'Taylor', 'Thomas'];
const DOMAINS = ['example.com', 'vault.dev', 'acme.io', 'testcorp.net', 'cloudlab.org'];
const ROLES = ['Admin', 'Developer', 'Designer', 'Product Manager', 'Viewer', 'Billing'];
const STATUSES = ['active', 'inactive', 'pending', 'suspended'];
const COUNTRIES = ['United States', 'Germany', 'United Kingdom', 'Canada', 'Japan', 'Australia', 'Netherlands', 'Singapore', 'Sweden'];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateFieldValue(type: FieldDataType, index: number): unknown {
  switch (type) {
    case 'uuid':
      return crypto.randomUUID();
    case 'id':
      return index + 1;
    case 'fullName':
      return `${getRandomItem(FIRST_NAMES)} ${getRandomItem(LAST_NAMES)}`;
    case 'email': {
      const first = getRandomItem(FIRST_NAMES).toLowerCase();
      const last = getRandomItem(LAST_NAMES).toLowerCase();
      const num = Math.floor(Math.random() * 90 + 10);
      const domain = getRandomItem(DOMAINS);
      return `${first}.${last}${num}@${domain}`;
    }
    case 'role':
      return getRandomItem(ROLES);
    case 'status':
      return getRandomItem(STATUSES);
    case 'number':
      return Math.floor(Math.random() * 900 + 100);
    case 'boolean':
      return Math.random() > 0.5;
    case 'isoDate': {
      const now = Date.now();
      const past = now - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365);
      return new Date(past).toISOString();
    }
    case 'country':
      return getRandomItem(COUNTRIES);
    default:
      return null;
  }
}

export function generateSyntheticJson(options: RandomJsonOptions): string {
  const count = Math.max(1, Math.min(100, options.count || 10));
  const fields = options.fields.length > 0 ? options.fields : [
    { id: '1', name: 'id', type: 'uuid' as FieldDataType },
    { id: '2', name: 'name', type: 'fullName' as FieldDataType },
    { id: '3', name: 'email', type: 'email' as FieldDataType },
    { id: '4', name: 'role', type: 'role' as FieldDataType },
    { id: '5', name: 'active', type: 'boolean' as FieldDataType },
  ];

  const records = [];

  for (let i = 0; i < count; i++) {
    const record: Record<string, unknown> = {};
    for (const field of fields) {
      if (field.name.trim()) {
        record[field.name.trim()] = generateFieldValue(field.type, i);
      }
    }
    records.push(record);
  }

  return JSON.stringify(records, null, 2);
}
