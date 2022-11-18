import { Timestamp } from 'firebase/firestore';
import { InputDesc } from './Input';
import { DEFAULT_SOURCED_DATA_PROPERTY, SourcedDataProperty } from './SourcedDataProperty';
import { SubItem, TypeOfName, TYPE_OF_NAME_LIST } from './SubItem';

export interface MinimalStreet {
  id: string;
  name: string;
  lastUpdate: Timestamp | null;
}

export interface Street {
  id: string;
  name: string;
  lastUpdate: Timestamp | null;
  typeOfName: SourcedDataProperty<TypeOfName>;
  nameOrigin: SourcedDataProperty<string>;
  nameDescription: SourcedDataProperty<string>;
  creationDate: SourcedDataProperty<string>;
  namingDate: SourcedDataProperty<string>;
  length: SourcedDataProperty<string>;
  width: SourcedDataProperty<string>;
  coords: string;
  subId: string | null;
}

export interface SuperStreet extends Street {
  subItem: SubItem | null;
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
  creationDate: DEFAULT_SOURCED_DATA_PROPERTY,
  namingDate: DEFAULT_SOURCED_DATA_PROPERTY,
  length: DEFAULT_SOURCED_DATA_PROPERTY,
  width: DEFAULT_SOURCED_DATA_PROPERTY,
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
    type: 'text',
  },
  {
    id: 'generalWidth',
    name: 'width',
    label: 'Largeur',
    type: 'text',
  },
  {
    id: 'generalTypeOfNameInput',
    name: 'typeOfName',
    label: 'Type de nom de la rue',
    type: 'select',
    values: TYPE_OF_NAME_LIST,
  },
] as InputDesc[];
