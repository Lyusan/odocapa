import { createClient } from '@supabase/supabase-js';
import { MinimalStreet, Street } from '../type/Street';
import { Database } from '../type/supabase';

const supabaseUrl = 'https://vyyllqxmvqemszxpcnow.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY!;
const supabase = createClient<Database>(supabaseUrl, supabaseKey);
// const activities = (await supabase.from('activity').select()).data as any[];

// function reduceCatActivity(acc: Record<string, number>, curr: Activity): Record<string, number> {
//   const current = activities.find((a: any) => a.name === curr.value);
//   const currentId = current?.id;
//   const currentLevel = curr.level;
//   const newValue = currentId ? { [currentId]: currentLevel } : {};
//   if (curr.subActivities?.length) {
//     return curr.subActivities.reduce(reduceCatActivity, { ...acc, ...newValue });
//   }
//   return { ...acc, ...newValue };
// }
// const SUB_ITEM_OLD_NEW_ID: Record<string, string> = {};

// async function insertSubItems(subItems: SubItem[]) {
//   // eslint-disable-next-line no-restricted-syntax
//   for (const subItem of subItems) {
//     // eslint-disable-next-line no-await-in-loop
//     const res = await supabase
//       .from('toponym')
//       .insert({
//         name: subItem.name?.value,
//         type: subItem.type,
//         wikipedia: {
//           value: subItem.description.source,
//           lastUpdate: subItem.description.lastUpdate,
//         },
//         lastUpdate: subItem.lastUpdate?.toDate(),
//       })
//       .select();
//     const id = res.data[0].id as string;
//     if (subItem.id) SUB_ITEM_OLD_NEW_ID[subItem.id] = id;
//     if (subItem.type === 'Bataille') {
//       const battle = subItem as SubItemBattle;
//       // eslint-disable-next-line no-await-in-loop
//       await supabase.from('toponymBattle').insert({
//         id,
//         startDate: battle.startDate,
//         endDate: battle.endDate,
//       });
//     }
//     if (subItem.type === 'Monument') {
//       const monument = subItem as SubMonumentItem;
//       // eslint-disable-next-line no-await-in-loop
//       await supabase.from('toponymBuilding').insert({
//         id,
//         endBuildingDate: monument.endBuildingDate,
//       });
//     }
//     if (subItem.type === 'Personne') {
//       const person = subItem as SubItemPerson;
//       // eslint-disable-next-line no-await-in-loop
//       const activitiesReduced = person.activity.value.reduce(reduceCatActivity, {});
//       // eslint-disable-next-line no-await-in-loop
//       await supabase.from('toponymPerson').insert({
//         id,
//         nationality: person.nationality,
//         birthday: person.birthday,
//         deathday: person.deathday,
//         lifeCentury: person.lifeCentury,
//         gender: person.gender,
//         politicScale: person.politicScale,
//         activities: activitiesReduced,
//       });
//     }
//   }
// }
// async function insertStreet(streets: Street[], subItemOldNewId: Record<string, string>) {
//   // eslint-disable-next-line no-restricted-syntax, guard-for-in
//   for (const streetIndex in streets) {
//     console.log(streetIndex);
//     const street = streets[streetIndex];
//     // eslint-disable-next-line no-await-in-loop
//     const res = await supabase
//       .from('street')
//       .insert({
//         lastUpdate: street.lastUpdate?.toDate(),
//         name: street.name,
//         length: street.length,
//         width: street.width,
//         coords: JSON.parse(street.coords),
//         parisDataInfo: street.parisDataInfo,
//         nameOrigin: street.nameOrigin,
//         history: street.nameDescription,
//         namingDate: street.nameDescription,
//         creationDate: street.nameDescription,
//       })
//       .select();
//     const id = res.data[0].id as string;
//     // eslint-disable-next-line no-restricted-syntax, guard-for-in
//     for (const index in street.subItems) {
//       // eslint-disable-next-line no-await-in-loop
//       await supabase
//         .from('relStreetToponym')
//         .insert({
//           streetId: id,
//           toponymId: subItemOldNewId[street.subItems[index].id!],
//           type: index === '0' ? 'primary' : 'secondary',
//         })
//         .select();
//     }
//   }
// }
// console.log('start');
// await insertSubItems((await getStreetSubItemsDocs()) as any);
// console.log('end subitem');
// await insertStreet(await getStreetsDocs(), SUB_ITEM_OLD_NEW_ID);
// console.log('end street');

// eslint-disable-next-line import/prefer-default-export
export async function getStreets() {
  const res = await supabase.from('street').select(
    `id ,name, length, width, coords, namingDate, creationDate, lastUpdate,
      relStreetToponym(toponymId, type),
      toponym(id, name, type, wikipedia, lastUpdate)`,
  );
  console.log(res.data);
  console.log(res.data?.filter((e) => (e.relStreetToponym as any)?.length));
}

export async function getMinimalStreets(): Promise<MinimalStreet[]> {
  const res = await supabase.from('street').select('id , name, lastUpdate');
  return res.data as MinimalStreet[];
}

export async function getStreet(id: string): Promise<Street | null> {
  const dbRes = await supabase
    .from('street')
    .select(
      `id, name, length, width, coords, namingDate, creationDate, lastUpdate, parisDataInfo, nameOrigin, history,
        relStreetToponym(toponymId, level,
            toponym(
                id, name, type, wikipedia, lastUpdate,
                toponymBattle(id, startDate, endDate),
                toponymBuilding(id, endBuildingDate),
                toponymPerson(id, nationality, birthday, deathday, lifeCentury, gender, politicScale, activities)
            )
        )`,
    )
    .order('level', { foreignTable: 'relStreetToponym', ascending: true })
    .eq('id', id);

  if (dbRes.data?.length !== 1) return null;
  const dbResData = dbRes.data[0];
  const resSubItems = (dbResData.relStreetToponym as any).map((rel: any) => {
    const { toponym } = rel;
    let subItem: any = {
      id: toponym.id,
      level: rel.level,
      name: toponym.name,
      type: toponym.type,
      wikipedia: toponym.wikipedia,
      lastUpdate: toponym.lastUpdate,
    };
    if (toponym.type === 'Bataille') {
      const battle = toponym.toponymBattle;
      subItem.startDate = battle.startDate;
      subItem.endDate = battle.endDate;
    }
    if (toponym.type === 'Monument') {
      const building = toponym.toponymBuilding;
      subItem.endBuildingDate = building.endBuildingDate;
    }
    if (toponym.type === 'Personne') {
      const person = toponym.toponymPerson;
      // person.activities = person.activities.value.reduce(reduceCatActivity, {});
      // delete person.activities;
      subItem = { ...subItem, ...person };
    }
    return subItem;
  });
  const res = {
    id: dbResData.id,
    name: dbResData.name,
    length: dbResData.length,
    width: dbResData.width,
    coords: dbResData.coords,
    namingDate: dbResData.namingDate,
    creationDate: dbResData.creationDate,
    lastUpdate: dbResData.lastUpdate,
    parisDataInfo: dbResData.parisDataInfo,
    nameOrigin: dbResData.nameOrigin,
    history: dbResData.history,
    subItems: resSubItems,
  };
  console.log(res);
  return res as any as Street;
}
