export interface Activity {
  value: string;
  level: number;
  subActivities?: Activity[];
}
export const DEFAULT_ACTIVITIES: Activity[] = [
  {
    value: 'ecclésiastique',
    level: 0,
    subActivities: [
      {
        value: 'chrétien',
        level: 0,
        subActivities: [
          {
            value: 'catholique',
            level: 0,
            subActivities: [
              {
                value: 'prêtre',
                level: 0,
              },
              {
                value: 'évêque',
                level: 0,
              },
              {
                value: 'moine',
                level: 0,
              },
            ],
          },
          {
            value: 'protestant',
            level: 0,
          },
          {
            value: 'orthodoxe',
            level: 0,
          },
          {
            value: 'preSchisme',
            level: 0,
          },
        ],
      },
    ],
  },
  {
    value: 'soft scientifique',
    level: 0,
    subActivities: [
      { value: 'historien', level: 0 },
      { value: 'sociologie', level: 0 },
    ],
  },
  {
    value: 'scientifique',
    level: 0,
    subActivities: [
      { value: 'médecin', level: 3 },
      { value: 'astronome', level: 2 },
      { value: 'mathématicien', level: 1 },
    ],
  },
  {
    value: 'politicien',
    level: 0,
  },
  {
    value: 'militaire',
    level: 0,
  },
  {
    value: 'justice',
    level: 0,
  },
];
