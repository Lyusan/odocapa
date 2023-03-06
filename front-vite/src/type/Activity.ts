export interface Activity {
  value: string;
  level: number;
  subActivities?: Activity[];
}

export interface CatActivity extends Activity {
  color: string;
  name: string;
}

export const DEFAULT_ACTIVITIES: CatActivity[] = [
  {
    value: 'ecclésiastique',
    name: 'Ecclésiastique',
    color: '#EE6352',
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
    name: 'Scientifique SHS',
    level: 0,
    color: '#00AA00',
    subActivities: [
      { value: 'historien', level: 0 },
      { value: 'sociologie', level: 0 },
      { value: 'philosophe', level: 0 },
      { value: 'anthropologue', level: 0 },
      { value: 'archéologie', level: 0 },
      { value: 'philologue', level: 0 },
      { value: 'juriste', level: 0 },
    ],
  },
  {
    value: 'scientifique',
    name: 'Scientifique',
    level: 0,
    color: '#0000AA',
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
      { value: 'architecte', level: 0 },
      { value: 'biologiste', level: 0 },
    ],
  },
  // {
  //   value: 'haut fonctionnaire',
  //   name: 'Haut fonctionnaire',
  //   level: 0,
  //   color: '#02182B',
  // },
  // {
  //   value: 'industriel',
  //   name: 'Industriel',
  //   level: 0,
  //   color: '#02182B',
  // },
  {
    value: 'artisant',
    name: 'Artisan',
    level: 0,
    color: '#02182B',
  },
  {
    value: 'journaliste',
    name: 'Journaliste',
    level: 0,
    color: '#68C5DB',
  },
  {
    value: 'police',
    name: 'Police',
    level: 0,
    color: '#68C5DB',
  },
  {
    value: 'artiste',
    name: 'Artiste',
    color: '#D7263D',
    level: 0,
    subActivities: [
      { value: 'peintre', level: 0 },
      { value: 'architecte', level: 0 },
      { value: 'photographe', level: 0 },
      {
        value: 'spectacle',
        level: 0,
        subActivities: [
          { value: 'danse', level: 0 },
          { value: 'chorégraphie', level: 0 },
          { value: 'actrice', level: 0 },
        ],
      },
      {
        value: 'musicien',
        level: 0,
        subActivities: [
          { value: 'compositeur', level: 0 },
          { value: 'pianiste', level: 0 },
          { value: 'chanteuse', level: 0 },
          { value: 'violoniste', level: 0 },
          { value: 'chef d’orchestre', level: 0 },
        ],
      },
      { value: 'sculteur', level: 0 },
      {
        value: 'écrivain',
        level: 0,
        subActivities: [
          { value: 'poète', level: 0 },
          { value: 'dramaturge', level: 0 },
          { value: 'romancier', level: 0 },
          { value: 'essayiste', level: 0 },
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
    value: 'homme d’affaire',
    name: 'Homme d’affaire',
    color: '#DDCA7D',
    level: 0,
  },
  {
    value: 'sportif',
    name: 'Sportif',
    color: '#DDCA7D',
    level: 0,
    subActivities: [{ value: 'escrimeur', level: 0 }],
  },
  {
    value: 'explorateur',
    name: 'Explorateur',
    color: '#DDCA7D',
    level: 0,
  },
  {
    value: 'noble',
    name: 'Noble',
    color: '#A27035',
    level: 0,
    subActivities: [
      { value: 'roi', level: 0 },
      { value: 'duc', level: 0 },
      { value: 'comte', level: 0 },
      { value: 'baron', level: 0 },
      { value: 'marquis', level: 0 },
    ],
  },
  // {
  //   value: 'banquier',
  //   name: 'Banquier',
  //   color: '#242331',
  //   level: 0,
  // },
  {
    value: 'politicien',
    name: 'Politicien',
    color: '#F76060',
    level: 0,
    subActivities: [{ value: 'syndicaliste', level: 0 }],
  },
  {
    value: 'militaire',
    name: 'Militaire',
    color: '#3B73D4',
    level: 0,
    subActivities: [
      { value: 'amiral', level: 0 },
      { value: 'vice-amiral', level: 0 },
      { value: 'général', level: 0 },
      { value: 'colonel', level: 0 },
      { value: 'lieutenent-colonel', level: 0 },
      { value: 'lieutenent', level: 0 },
      { value: 'maréchal', level: 0 },
      { value: "chef d'état-major", level: 0 },
    ],
  },
  {
    value: 'résistant',
    name: 'Résistant',
    color: '#4D5061',
    level: 0,
  },
  {
    value: 'justice',
    name: 'Professionel de la justice',
    color: '#FF8D8D',
    level: 0,
    subActivities: [{ value: 'avocat', level: 0 }],
  },
  {
    value: 'marchand',
    name: 'Marchand',
    color: '#FF8D8D',
    level: 0,
  },
  {
    value: 'propriétaire',
    name: 'Propriétaire',
    color: '#E7E247',
    level: 0,
    subActivities: [
      { value: 'proprio', level: 0 },
      { value: 'habitant', level: 0 },
    ],
  },
];
