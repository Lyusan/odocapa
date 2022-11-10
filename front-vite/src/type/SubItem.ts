import { Timestamp } from 'firebase/firestore';
import { Activity, DEFAULT_ACTIVITIES } from './Activity';
import {
  DEFAULT_SOURCED_DATA_PROPERTY,
  SourcedDataProperty,
  SourcedDataPropertyType,
} from './SourcedDataProperty';

export interface StreetSubItemPerson {
  id: string | null;
  lastUpdate: Timestamp | null;

  type: SourcedDataPropertyType;

  name: SourcedDataProperty<string>;
  description: SourcedDataProperty<string>;

  nationality: SourcedDataProperty<string>;
  birthday: SourcedDataProperty<string>;
  deathday: SourcedDataProperty<string>;
  gender: SourcedDataProperty<string>;
  activity: SourcedDataProperty<Activity[]>;
}
export interface MinimalStreetSub {
  id: string;
  name: string;
}

export const DEFAULT_SUB_ITEM = {
  id: null,
  lastUpdate: null,
  name: DEFAULT_SOURCED_DATA_PROPERTY,
  description: DEFAULT_SOURCED_DATA_PROPERTY,
};

export const DEFAULT_STREET_SUB_ITEM = {
  ...DEFAULT_SUB_ITEM,
  nationality: DEFAULT_SOURCED_DATA_PROPERTY,
  birthday: DEFAULT_SOURCED_DATA_PROPERTY,
  deathday: DEFAULT_SOURCED_DATA_PROPERTY,
  gender: DEFAULT_SOURCED_DATA_PROPERTY,
  activity: { ...DEFAULT_SOURCED_DATA_PROPERTY, value: DEFAULT_ACTIVITIES },
};
