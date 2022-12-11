import { Timestamp } from 'firebase/firestore';
import { Activity } from './Activity';
import { InputDesc } from './Input';
import { PoliticScale } from './PoliticScale';
import {
  DEFAULT_SOURCED_DATA_PROPERTY,
  DEFAULT_SOURCED_DATA_PROPERTY_NULL,
  SourcedDataProperty,
} from './SourcedDataProperty';

export const CAT_TYPE_OTHER = {
  name: 'Autre',
  color: '#BFEDC1',
};
export const CAT_TYPE_OF_NAME_LIST = [
  {
    name: 'Personne',
    color: '#BF3131',
  },
  {
    name: 'Ville',
    color: '#E08C2B',
  },
  {
    name: 'Bataille',
    color: '#31DCC8',
  },
  {
    name: 'Enseigne',
    color: '#006CC8',
  },
  {
    name: 'Profession',
    color: '#985F99',
  },
  {
    name: 'Monument',
    color: '#2CCB13',
  },
  CAT_TYPE_OTHER,
] as const;
export const TYPE_OF_NAME_LIST = CAT_TYPE_OF_NAME_LIST.map((e) => e.name);
export type TypeOfName = typeof TYPE_OF_NAME_LIST[number];

export interface SubItem {
  id: string | null;
  lastUpdate: Timestamp | null;

  type: TypeOfName;

  name: SourcedDataProperty<string>;
  description: SourcedDataProperty<string>;
}

export interface SubItemPerson extends SubItem {
  nationality: SourcedDataProperty<string>;
  birthday: SourcedDataProperty<string>;
  deathday: SourcedDataProperty<string>;
  gender: SourcedDataProperty<string>;
  lifeCentury: SourcedDataProperty<number>;
  politicScale: SourcedDataProperty<PoliticScale[]>;
  activity: SourcedDataProperty<Activity[]>;
}

export interface SubItemBattle extends SubItem {
  startDate: SourcedDataProperty<string>;
  endDate: SourcedDataProperty<string>;
}

export interface SubMonumentItem extends SubItem {
  endBuildingDate: SourcedDataProperty<string>;
}

export interface MinimalSubItem {
  id: string;
  name: string;
}

export const DEFAULT_SUB_ITEM = {
  id: null,
  lastUpdate: null,
  name: DEFAULT_SOURCED_DATA_PROPERTY,
  description: DEFAULT_SOURCED_DATA_PROPERTY,
};

export const DEFAULT_BATTLE_SUB_ITEM = {
  ...DEFAULT_SUB_ITEM,
  startDate: DEFAULT_SOURCED_DATA_PROPERTY,
  endDate: DEFAULT_SOURCED_DATA_PROPERTY,
};

export const DEFAULT_MONUMENT_SUB_ITEM = {
  ...DEFAULT_SUB_ITEM,
  endBuildingDate: DEFAULT_SOURCED_DATA_PROPERTY,
};

export const DEFAULT_PERSON_SUB_ITEM = {
  ...DEFAULT_SUB_ITEM,
  nationality: DEFAULT_SOURCED_DATA_PROPERTY,
  birthday: DEFAULT_SOURCED_DATA_PROPERTY,
  deathday: DEFAULT_SOURCED_DATA_PROPERTY,
  lifeCentury: DEFAULT_SOURCED_DATA_PROPERTY_NULL,
  gender: DEFAULT_SOURCED_DATA_PROPERTY,
  activity: { ...DEFAULT_SOURCED_DATA_PROPERTY, value: [] },
  politicScale: { ...DEFAULT_SOURCED_DATA_PROPERTY, value: [] },
};

export const GENERAL_SUB_ITEM_FORM_DESC = [
  {
    id: 'subNameInput',
    name: 'name',
    label: 'Nom complet',
    type: 'text',
  },
  {
    id: 'subDescInput',
    name: 'description',
    wikiPropName: 'descriptionParts',
    label: 'Description',
    type: 'textarea',
  },
];

export const PERSON_FORM_DESC = [
  ...GENERAL_SUB_ITEM_FORM_DESC,
  {
    id: 'personNationlityInput',
    name: 'nationality',
    label: 'Nationalité',
    type: 'text',
  },
  {
    id: 'personBirthdayInput',
    name: 'birthday',
    label: 'Date de naissance',
    type: 'text',
  },
  {
    id: 'personLifeCenturyInput',
    name: 'lifeCentury',
    label: 'Siècle de vie',
    type: 'number',
  },
  {
    id: 'personDeathdayInput',
    name: 'deathday',
    label: 'Date du décès',
    type: 'text',
  },
  {
    id: 'personGenderInput',
    name: 'gender',
    label: 'Genre',
    type: 'select',
    values: ['Inconnu', 'Homme', 'Femme'],
  },
  {
    id: 'personPoliticScaleInput',
    name: 'politicScale',
    label: 'Échelle Politique',
    type: 'politicScale',
  },
  {
    id: 'personActivityInput',
    name: 'activity',
    label: 'Activité',
    type: 'activity',
  },
] as InputDesc[];

export const BATTLE_FORM_DESC = [
  ...GENERAL_SUB_ITEM_FORM_DESC,
  {
    id: 'battleDateStartInput',
    name: 'startDate',
    label: 'Date de debut',
    type: 'text',
  },
  {
    id: 'battleDateStartInput',
    name: 'endDate',
    label: 'Date de fin',
    type: 'text',
  },
] as InputDesc[];

export const MONUMENT_FORM_DESC = [
  ...GENERAL_SUB_ITEM_FORM_DESC,
  {
    id: 'monumentEndBuildingDate',
    name: 'endBuildingDate',
    label: 'Date de fin de construction',
    type: 'text',
  },
] as InputDesc[];

export const SUB_ITEM_MAP = {
  Personne: {
    form: PERSON_FORM_DESC,
    default: DEFAULT_PERSON_SUB_ITEM,
  },
  Bataille: {
    form: BATTLE_FORM_DESC,
    default: DEFAULT_BATTLE_SUB_ITEM,
  },
  Ville: {
    form: GENERAL_SUB_ITEM_FORM_DESC,
    default: DEFAULT_SUB_ITEM,
  },
  Monument: {
    form: MONUMENT_FORM_DESC,
    default: DEFAULT_MONUMENT_SUB_ITEM,
  },
  Profession: {
    form: GENERAL_SUB_ITEM_FORM_DESC,
    default: DEFAULT_SUB_ITEM,
  },
  Enseigne: {
    form: GENERAL_SUB_ITEM_FORM_DESC,
    default: DEFAULT_SUB_ITEM,
  },
  Autre: {
    form: GENERAL_SUB_ITEM_FORM_DESC,
    default: DEFAULT_SUB_ITEM,
  },
} as Record<TypeOfName, { form: InputDesc[]; default: any }>;
