import { Timestamp } from 'firebase/firestore';

export enum SourcedDataPropertyType {
  COPY = 'copy_from_source',
  COPY_EDITED = 'edited_from_source',
  CUSTOM = 'custom',
}

export interface SourcedDataProperty<Type> {
  value: Type;
  lastUpdate: Timestamp | null;
  source: string | null;
  type: SourcedDataPropertyType | null;
}

export const DEFAULT_SOURCED_DATA_PROPERTY = {
  value: '',
  lastUpdate: null,
  source: null,
  type: null,
};

export const DEFAULT_SOURCED_DATA_PROPERTY_NULL = {
  value: null,
  lastUpdate: null,
  source: null,
  type: null,
};
