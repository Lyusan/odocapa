import { SuperStreet } from './Street';
import { CAT_TYPE_OF_NAME_LIST, SubItemPerson } from './SubItem';

export interface CategorieValue {
  name: string;
  color: string;
}

export interface Categorie {
  name: string;
  values: CategorieValue[];
  categorize: (street: SuperStreet) => CategorieValue | null;
}

export type Categories = Categorie[];

const CAT_GENDER_LIST = [
  {
    name: 'Homme',
    color: '#E08C2B',
  },
  {
    name: 'Femme',
    color: '#BF3131',
  },
  {
    name: 'Inconnu',
    color: '#805B90',
  },
] as const;

const CAT_CENTURIES_LIST = [
  {
    name: 'Inconnu',
    color: '#111111',
  },
  {
    name: 'Ie',
    color: '#09b405',
  },
  {
    name: 'Ie',
    color: '#09b405',
  },
  {
    name: 'IIe',
    color: '#0ac236',
  },
  {
    name: 'IIIe',
    color: '#0bd167',
  },
  {
    name: 'IVe',
    color: '#0bdf97',
  },
  {
    name: 'Ve',
    color: '#0ceec8',
  },
  {
    name: 'VIe',
    color: '#0cfcf8',
  },
  {
    name: 'VIIe',
    color: '#0acdf2',
  },
  {
    name: 'VIIIe',
    color: '#00bb9e',
  },
  {
    name: 'IXe',
    color: '#089eec',
  },
  {
    name: 'Xe',
    color: '#066fe6',
  },
  {
    name: 'XIe',
    color: '#0540e1',
  },
  {
    name: 'XIIe',
    color: '#0310db',
  },
  {
    name: 'XIIIe',
    color: '#341de2',
  },
  {
    name: 'XIVe',
    color: '#662be9',
  },
  {
    name: 'XVe',
    color: '#9738ef',
  },
  {
    name: 'XVIe',
    color: '#c946f6',
  },
  {
    name: 'XVIIe',
    color: '#fa53fc',
  },
  {
    name: 'XVIIIe',
    color: '#fb42cf',
  },
  {
    name: 'XIXe',
    color: '#fe1149',
  },
  {
    name: 'XXe',
    color: '#ff001c',
  },
] as const;
export const CATEGORIES = [
  {
    name: 'Type',
    values: CAT_TYPE_OF_NAME_LIST,
    categorize: (street: SuperStreet) =>
      (CAT_TYPE_OF_NAME_LIST.find((cv) => street.typeOfName.value === cv.name) as any) || null,
  },
  {
    name: 'Genre',
    values: CAT_GENDER_LIST,
    categorize: (street: SuperStreet) => {
      if (street.typeOfName.value !== 'Personne') return null;
      return CAT_GENDER_LIST.find(
        (c) => c.name === (street.subItem as SubItemPerson)?.gender?.value,
      );
    },
  },
  {
    name: 'Activités',
    values: [
      {
        name: 'Militaire',
        color: '#440D0F',
      },
      {
        name: 'Scientifique',
        color: 'blue',
      },
      {
        name: 'Science humaine',
        color: 'cyan',
      },
      {
        name: 'Ecclésiastique',
        color: 'black',
      },
      {
        name: 'Artiste',
        color: 'black',
      },
      {
        name: 'Autre',
        color: 'black',
      },
    ],
    categorize: () => null,
  },
  {
    name: 'Opinion politique',
    values: [],
    categorize: () => null,
  },
  {
    name: 'Siecles',
    values: CAT_CENTURIES_LIST,
    categorize: (street: SuperStreet) => {
      if (street.typeOfName.value !== 'Personne') return null;
      let birthdayValue = (street.subItem as SubItemPerson)?.birthday?.value;
      birthdayValue = Array.isArray(birthdayValue) ? birthdayValue[0] : birthdayValue;
      let deathdayValue = (street.subItem as SubItemPerson)?.deathday?.value;
      deathdayValue = Array.isArray(deathdayValue) ? deathdayValue[0] : deathdayValue;
      const regex = /[0-9][0-9][0-9][0-9]/g;
      const birthday = Number(birthdayValue?.match(regex)?.[0]);
      const deathday = Number(deathdayValue?.match(regex)?.[0]);
      if (Number.isNaN(birthday) || Number.isNaN(deathday)) return CAT_CENTURIES_LIST[0];
      const index = Math.floor((birthday + deathday) / 2 / 100) + 2;
      return CAT_CENTURIES_LIST[index] || CAT_CENTURIES_LIST[0];
    },
  },
] as Categorie[];
