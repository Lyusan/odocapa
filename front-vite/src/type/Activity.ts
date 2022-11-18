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
      { value: 'philosophe', level: 0 },
      { value: 'anthropologue', level: 0 },
      { value: 'archéologie', level: 0 },
    ],
  },
  {
    value: 'scientifique',
    level: 0,
    subActivities: [
      { value: 'médecin', level: 0 },
      { value: 'astronome', level: 0 },
      { value: 'mathématicien', level: 0 },
      { value: 'chimiste', level: 0 },
      { value: 'biochimiste', level: 0 },
      { value: 'botaniste', level: 0 },
      { value: 'physicien', level: 0 },
      { value: 'inventeur', level: 0 },
      { value: 'ingénieur', level: 0 },
      { value: 'économiste', level: 0 },
    ],
  },
  {
    value: 'industriel',
    level: 0,
  },
  {
    value: 'journaliste',
    level: 0,
  },
  {
    value: 'artiste',
    level: 0,
    subActivities: [
      { value: 'peintre', level: 0 },
      { value: 'architecte', level: 0 },
      { value: 'photographe', level: 0 },
      {
        value: 'musicien',
        level: 0,
        subActivities: [
          { value: 'compositeur', level: 0 },
          { value: 'pianiste', level: 0 },
        ],
      },
      { value: 'sculteur', level: 0 },
      {
        value: 'écrivain',
        level: 0,
        subActivities: [
          { value: 'poète', level: 0 },
          { value: 'dramaturge', level: 0 },
        ],
      },
      {
        value: 'cinema',
        level: 0,
        subActivities: [
          { value: 'réalisateur', level: 0 },
          { value: 'scénariste', level: 0 },
          { value: 'acteur', level: 0 },
        ],
      },
    ],
  },
  {
    value: 'explorateur',
    level: 0,
  },
  {
    value: 'banquier',
    level: 0,
  },
  {
    value: 'politicien',
    level: 0,
    subActivities: [{ value: 'syndicaliste', level: 0 }],
  },
  {
    value: 'militaire',
    level: 0,
    subActivities: [
      { value: 'amiral', level: 0 },
      { value: 'vice-amiral', level: 0 },
      { value: 'général', level: 0 },
      { value: 'colonel', level: 0 },
      { value: 'lieutenent-colonel', level: 0 },
      { value: 'lieutenent', level: 0 },
      { value: 'maréchal', level: 0 },
    ],
  },
  {
    value: 'résistant',
    level: 0,
  },
  {
    value: 'justice',
    level: 0,
    subActivities: [{ value: 'avocat', level: 0 }],
  },
  {
    value: 'propriétaire',
    level: 0,
  },
];
