import { Timestamp } from 'firebase/firestore';
import { InputDesc } from './Input';
import {
  DEFAULT_SOURCED_DATA_PROPERTY,
  DEFAULT_SOURCED_DATA_PROPERTY_NULL,
  SourcedDataProperty,
} from './SourcedDataProperty';
import { SubItem } from './SubItem';

export interface MinimalStreet {
  id: string;
  name: string;
  lastUpdate: Timestamp | null;
}

export interface Street {
  id: string;
  name: string;
  lastUpdate: Timestamp | null;
  nameOrigin: SourcedDataProperty<string>;
  nameDescription: SourcedDataProperty<string>;
  creationDate: SourcedDataProperty<string>;
  namingDate: SourcedDataProperty<string>;
  length: SourcedDataProperty<number | null>;
  width: SourcedDataProperty<number | null>;
  coords: string;
  parisDataInfo: any;
  subIds: string[];
  subItems: SubItem[];
}

export const DEFAULT_STREET = {
  lastUpdate: null,

  nameOrigin: DEFAULT_SOURCED_DATA_PROPERTY,
  nameDescription: DEFAULT_SOURCED_DATA_PROPERTY,
  creationDate: DEFAULT_SOURCED_DATA_PROPERTY,
  namingDate: DEFAULT_SOURCED_DATA_PROPERTY,

  length: DEFAULT_SOURCED_DATA_PROPERTY_NULL,
  width: DEFAULT_SOURCED_DATA_PROPERTY_NULL,

  subIds: [],
  subItems: [],
};

export const STREET_FORM_DESC = [
  {
    id: 'generalNameOriginInput',
    name: 'nameOrigin',
    label: 'Origine du nom de la rue',
    type: 'textarea',
  },
  {
    id: 'generalNameDescriptionInput',
    name: 'nameDescription',
    wikiPropName: 'history',
    label: 'Description du nom de la rue',
    type: 'textarea',
  },
  {
    id: 'generalCreationDate',
    name: 'creationDate',
    label: 'Date de création',
    type: 'text',
  },
  {
    id: 'generalNamingDate',
    name: 'namingDate',
    label: 'Date de dénomination',
    type: 'text',
  },
  {
    id: 'generalLength',
    name: 'length',
    label: 'Longueur',
    type: 'number',
  },
  {
    id: 'generalWidth',
    name: 'width',
    label: 'Largeur',
    type: 'number',
  },
] as InputDesc[];
