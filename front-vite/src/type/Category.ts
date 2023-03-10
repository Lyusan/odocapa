/* eslint-disable prefer-destructuring */
import { DEFAULT_ACTIVITIES } from './Activity';
import { CAT_POLITIC_SCALE_LIST } from './PoliticScale';
import { Street } from './Street';
import { CAT_TYPE_OF_NAME_LIST, CAT_TYPE_OTHER, SubItemPerson } from './SubItem';

export interface CategoryValue {
  name: string;
  color?: string;
}

export interface Category {
  name: string;
  values: CategoryValue[];
  secondary?: boolean;
  categorize: (street: Street) => {
    primary: CategoryValue | null;
    secondary: CategoryValue[];
    tertiary: CategoryValue[];
  };
}

const DEFAULT_RESULT = {
  primary: null,
  secondary: [],
  tertiary: [],
};
export type Categories = Category[];

const CAT_ACTIVITY_LIST = DEFAULT_ACTIVITIES.map((e) => ({
  name: e.name,
  color: e.color,
  value: e.value,
})).sort((a, b) => a.name.localeCompare(b.name));

export const CAT_DISTRICT = [
  { name: '1e' },
  { name: '2e' },
  { name: '3e' },
  { name: '4e' },
  { name: '5e' },
  { name: '6e' },
  { name: '7e' },
  { name: '8e' },
  { name: '9e' },
  { name: '10e' },
  { name: '11e' },
  { name: '12e' },
  { name: '13e' },
  { name: '14e' },
  { name: '15e' },
  { name: '16e' },
  { name: '17e' },
  { name: '18e' },
  { name: '19e' },
  { name: '20e' },
  { name: 'Hors Paris' },
] as const;

const CAT_TYPE_DE = [
  {
    name: 'rue',
    color: '#E08C2B',
  },
  {
    name: 'route',
    color: '#E08C2B',
  },
  {
    name: 'chemin',
    color: '#E08C2B',
  },
  {
    name: 'allée',
    color: '#E08C2B',
  },
  {
    name: 'boulevard',
    color: '#BF3131',
  },
  {
    name: 'avenue',
    color: '#BF3131',
  },
  {
    name: 'carrefour',
    color: '#31DCC8',
  },

  {
    name: 'rond-point',
    color: '#31DCC8',
  },
  {
    name: 'place',
    color: '#31DCC8',
  },
  {
    name: 'porte',
    color: '#31DCC8',
  },

  {
    name: 'pont',
    color: '#006CC8',
  },
  {
    name: 'port',
    color: '#006CC8',
  },
  {
    name: 'quai',
    color: '#006CC8',
  },
  {
    name: 'promenade',
    color: '#2CCB13',
  },

  {
    name: 'square',
    color: '#2CCB13',
  },
  {
    name: 'impasse',
    color: '#BFEDC1',
  },
  {
    name: 'cité',
    color: '#BFEDC1',
  },
  {
    name: 'villa',
    color: '#BFEDC1',
  },
  {
    name: 'galerie',
    color: '#BFEDC1',
  },
  {
    name: 'esplanade',
    color: '#805B90',
  },
  {
    name: 'passage',
    color: '#805B90',
  },
  {
    name: 'voie',
    color: '#805B90',
  },
  {
    name: 'other',
    color: '#805B90',
  },
] as const;

const CAT_GENDER_LIST = [
  {
    name: 'Homme',
    color: '#805B90',
  },
  {
    name: 'Femme',
    color: '#2CCB13',
  },
  {
    name: 'Inconnu',
    color: '#3B73D4',
  },
] as const;

const CAT_CENTURIES_LIST = [
  {
    name: 'Inconnu',
    color: '#3B73D4',
  },
  {
    name: 'Ie - Ve',
    color: '#573272',
  },
  {
    name: 'VIe - Xe',
    color: '#6C4273',
  },
  {
    name: 'XIe - XIVe',
    color: '#805174',
  },
  {
    name: 'XVe',
    color: '#946175',
  },
  {
    name: 'XVIe',
    color: '#A97077',
  },
  {
    name: 'XVIIe',
    color: '#BD8078',
  },
  {
    name: 'XVIIIe',
    color: '#D18F79',
  },
  {
    name: 'XIXe',
    color: '#E69F7A',
  },
  {
    name: 'XXe',
    color: '#FAAE7B',
  },
] as const;

const CAT_NAME_CENTURY = [
  {
    name: 'Inconnu',
    color: '#3B73D4',
  },
  {
    name: 'XIIIe',
    color: '#573272',
  },
  {
    name: 'XIVe',
    color: '#6C4273',
  },
  {
    name: 'XVe',
    color: '#805174',
  },
  {
    name: 'XVIe',
    color: '#946175',
  },
  {
    name: 'XVIIe',
    color: '#A97077',
  },
  {
    name: 'XVIIIe',
    color: '#BD8078',
  },
  {
    name: 'XIXe',
    color: '#D18F79',
  },
  {
    name: 'XXe',
    color: '#E69F7A',
  },
  {
    name: 'XXIe',
    color: '#FAAE7B',
  },
] as const;

export const CATEGORIES_DESC = [
  {
    name: 'Type de nom',
    values: CAT_TYPE_OF_NAME_LIST,
    categorize: (street: Street) => {
      const primary =
        (CAT_TYPE_OF_NAME_LIST.find((cv) => street.subItems?.[0]?.type === cv.name) as any) ||
        (street?.lastUpdate ? CAT_TYPE_OTHER : null);
      return { ...DEFAULT_RESULT, primary };
    },
  },
  {
    name: 'Arrondissement',
    values: CAT_DISTRICT,
    secondary: true,
    categorize: (street: Street) => {
      const secondary = street.parisDataInfo.district.map(
        (d: string) => CAT_DISTRICT.find((c) => c.name === (d[0] === '0' ? d.slice(1) : d)) as any,
      );
      return { ...DEFAULT_RESULT, secondary };
    },
  },
  {
    name: 'Genre',
    values: CAT_GENDER_LIST,
    categorize: (street: Street) => {
      const primary = CAT_GENDER_LIST.find((c) => {
        const streetSubItemGender = (street.subItems?.[0] as any)?.gender?.value;
        if (streetSubItemGender === '' && c.name === 'Inconnu') return true;
        return c.name === streetSubItemGender ?? null;
      });
      return { ...DEFAULT_RESULT, primary };
    },
  },
  {
    name: 'Activité',
    values: CAT_ACTIVITY_LIST,
    categorize: (street: Street) => {
      if (street.subItems?.[0]?.type !== 'Personne') return null;
      const person = street.subItems?.[0] as SubItemPerson;
      const primaryActivity = person.activity.value.find((a) => a.level === 3);
      const primary = CAT_ACTIVITY_LIST.find((c) => c.value === primaryActivity?.value);
      const secondary = CAT_ACTIVITY_LIST.filter(
        (c) => !!person.activity?.value?.find((ps) => ps.level === 2 && c.value === ps.value),
      );
      const tertiary = CAT_ACTIVITY_LIST.filter(
        (c) => !!person.activity?.value?.find((ps) => ps.level === 1 && c.value === ps.value),
      );
      return {
        primary,
        secondary,
        tertiary,
      };
    },
  },
  {
    name: 'Opinion politique',
    select: 'multiple',
    values: CAT_POLITIC_SCALE_LIST,
    categorize: (street: Street) => {
      if (street.subItems?.[0]?.type !== 'Personne') return null;
      const person = street.subItems?.[0] as SubItemPerson;
      const primary = CAT_POLITIC_SCALE_LIST.find(
        (c) => c.name === person.politicScale?.value?.[0]?.value,
      );
      const secondary = CAT_POLITIC_SCALE_LIST.filter(
        (c) => !!person.politicScale?.value?.find((ps) => ps.level === 2 && c.name === ps.value),
      );
      const tertiary = CAT_POLITIC_SCALE_LIST.filter(
        (c) => !!person.politicScale?.value?.find((ps) => ps.level === 1 && c.name === ps.value),
      );
      return {
        ...DEFAULT_RESULT,
        primary,
        secondary,
        tertiary,
      };
    },
  },
  {
    name: 'Siècle',
    values: CAT_CENTURIES_LIST,
    categorize: (street: Street) => {
      if (street.subItems?.[0]?.type !== 'Personne') return null;
      let birthdayValue = (street.subItems?.[0] as SubItemPerson)?.birthday?.value;
      birthdayValue = Array.isArray(birthdayValue) ? birthdayValue[0] : birthdayValue;
      let deathdayValue = (street.subItems?.[0] as SubItemPerson)?.deathday?.value;
      deathdayValue = Array.isArray(deathdayValue) ? deathdayValue[0] : deathdayValue;
      const regex = /[0-9][0-9][0-9][0-9]/g;
      const birthday = Number(birthdayValue?.match(regex)?.[0]);
      const deathday = Number(deathdayValue?.match(regex)?.[0]);
      let century: number;
      if (Number.isNaN(birthday) || Number.isNaN(deathday)) {
        if ((street.subItems?.[0] as SubItemPerson).lifeCentury.value !== null) {
          century = (street.subItems?.[0] as SubItemPerson).lifeCentury.value;
        } else return { ...DEFAULT_RESULT, primary: CAT_CENTURIES_LIST[0] };
      } else century = Math.floor((birthday + deathday) / 2 / 100);
      let cat: CategoryValue;
      if (century < 6) cat = CAT_CENTURIES_LIST[1];
      else if (century < 11) cat = CAT_CENTURIES_LIST[2];
      else if (century < 15) cat = CAT_CENTURIES_LIST[3];
      else cat = CAT_CENTURIES_LIST[century - 11];
      return { ...DEFAULT_RESULT, primary: cat };
    },
  },
  {
    name: 'Type de voie',
    values: CAT_TYPE_DE,
    categorize: (street: Street) => {
      const type = street.parisDataInfo.type;
      console.log(type);
      let primary = CAT_TYPE_DE.find((c) => c.name === type);
      if (!primary) primary = CAT_TYPE_DE.find((c) => c.name === 'other');
      return {
        ...DEFAULT_RESULT,
        primary,
      };
    },
  },
  {
    name: 'Siècle de dénomination',
    values: CAT_NAME_CENTURY,
    categorize: (street: Street) => {
      const century = street.parisDataInfo.century;
      let primary: CategoryValue = CAT_NAME_CENTURY[0];
      if (century) primary = CAT_NAME_CENTURY[century - 12];
      return {
        ...DEFAULT_RESULT,
        primary,
      };
    },
  },
] as Category[];
