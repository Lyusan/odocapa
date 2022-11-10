import { Timestamp } from 'firebase/firestore';
import { DEFAULT_SOURCED_DATA_PROPERTY, SourcedDataProperty } from './SourcedDataProperty';

export interface MinimalStreet {
  id: string;
  name: string;
  lastUpdate: Timestamp | null;
}

export interface Street {
  id: string;
  name: string;
  lastUpdate: Timestamp | null;
  typeOfName: SourcedDataProperty<string>;
  nameOrigin: SourcedDataProperty<string>;
  nameDescription: SourcedDataProperty<string>;
  coords: string;
  subId: string | null;
}

export const DEFAULT_STREET = {
  lastUpdate: null,
  typeOfName: {
    value: 'Personne',
    lastUpdate: null,
    source: null,
    type: null,
  },
  nameOrigin: DEFAULT_SOURCED_DATA_PROPERTY,
  nameDescription: DEFAULT_SOURCED_DATA_PROPERTY,
};
