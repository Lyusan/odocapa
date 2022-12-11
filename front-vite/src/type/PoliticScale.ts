export const CAT_POLITIC_SCALE_LIST = [
  {
    name: 'Anarchiste',
    color: '#262520',
  },
  {
    name: 'Communiste',
    color: '#C60C0C',
  },
  {
    name: 'Socialiste',
    color: '#FF8D8D',
  },
  {
    name: 'Centriste',
    color: '#E9EDDE',
  },
  {
    name: 'Droite',
    color: '#5C80BC',
  },
  {
    name: 'Nationaliste',
    color: '#4D6692',
  },
  {
    name: 'Royaliste',
    color: '#3B73D4',
  },
] as const;
export const POLITIC_SCALE_LIST = CAT_POLITIC_SCALE_LIST.map((e) => e.name);
export type PoliticScaleValues = typeof POLITIC_SCALE_LIST[number];

export interface PoliticScale {
  value: PoliticScaleValues;
  level: number;
}
