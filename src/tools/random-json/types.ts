export type FieldDataType =
  | 'uuid'
  | 'id'
  | 'fullName'
  | 'email'
  | 'role'
  | 'status'
  | 'number'
  | 'boolean'
  | 'isoDate'
  | 'country';

export interface SchemaField {
  id: string;
  name: string;
  type: FieldDataType;
}

export interface RandomJsonOptions {
  count: number;
  fields: SchemaField[];
}
