// eslint-disable-next-line max-classes-per-file
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  FirestoreDataConverter,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  query,
  QueryDocumentSnapshot,
  setDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { DEFAULT_STREET, MinimalStreet, Street } from '../type/Street';
import {
  MinimalSubItem,
  SubItem,
  SubItemBattle,
  SubItemPerson,
  SubMonumentItem,
  SUB_ITEM_MAP,
  TypeOfName,
} from '../type/SubItem';
import { TtTt } from '../helper/map';
import { createClient } from '@supabase/supabase-js';
import { Activity, CatActivity } from '../type/Activity';

const firebaseApp = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
});
const db = getFirestore(firebaseApp);
const TOP = 7000;
const STREET_COLLECTION = 'streets-3';
async function hash(message: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const encodedHash = await crypto.subtle.digest('SHA-256', data);
  const hashValue = Array.from(new Uint8Array(encodedHash))
    .map((bytes) => bytes.toString(16).padStart(2, '0'))
    .join('');
  return hashValue;
}

/* eslint-disable class-methods-use-this */
export class MinimalStreetSubConverter implements FirestoreDataConverter<MinimalSubItem> {
  toFirestore(): DocumentData {
    throw new Error('This is not supported');
  }

  fromFirestore(snapshot: QueryDocumentSnapshot): MinimalSubItem {
    const data = snapshot.data()!;
    return { name: data.name.value, id: snapshot.id } as MinimalSubItem;
  }
}

/* eslint-disable class-methods-use-this */
export class StreetSubItemConverter implements FirestoreDataConverter<SubItem> {
  toFirestore(street: SubItem): DocumentData {
    const data = { ...street } as any;
    delete data.id;
    return data;
  }

  fromFirestore(snapshot: QueryDocumentSnapshot): SubItem {
    const data = snapshot.data()!;
    const type = data.type as TypeOfName;
    const defaultValues = SUB_ITEM_MAP[type].default;
    return { ...defaultValues, ...data, id: snapshot.id } as SubItem;
  }
}

/* eslint-disable class-methods-use-this */
export class StreetConverter implements FirestoreDataConverter<Street> {
  toFirestore(street: Street): DocumentData {
    const data = { ...street } as any;
    delete data.id;
    delete data.subItems;
    return data;
  }

  fromFirestore(snapshot: QueryDocumentSnapshot): Street {
    const data = snapshot.data()!;
    return { id: snapshot.id, ...DEFAULT_STREET, ...data } as any as Street;
  }
}

/* eslint-disable class-methods-use-this */
export class MinimalStreetConverter implements FirestoreDataConverter<MinimalStreet> {
  toFirestore(street: MinimalStreet): DocumentData {
    const data = { ...street } as any;
    delete data.id;
    return data;
  }

  fromFirestore(snapshot: QueryDocumentSnapshot): MinimalStreet {
    const data = snapshot.data()!;
    return { id: snapshot.id, ...data } as MinimalStreet;
  }
}

export async function batchSetStreets(streets: TtTt[]) {
  let batch = writeBatch(db);
  // eslint-disable-next-line guard-for-in, no-restricted-syntax
  for (const index in streets) {
    // eslint-disable-next-line no-await-in-loop
    const h = await hash(streets[index].name);
    const street = {
      name: streets[index].name,
      coords: JSON.stringify(streets[index].coords),
    };
    if (street.name !== undefined) {
      batch.set(doc(db, STREET_COLLECTION, h), street);
    }
    if (Number(index) % 300 === 0) {
      // eslint-disable-next-line no-await-in-loop
      await batch.commit();
      batch = writeBatch(db);
    }
  }
}

export async function getMinimalStreetsDocs(): Promise<MinimalStreet[]> {
  const snapshot = await getDocs(
    query(
      collection(db, STREET_COLLECTION),
      // where('parisDataInfo.district', 'array-contains-any', ['01e', '02e']),
      limit(TOP),
    ).withConverter(new MinimalStreetConverter()),
  );
  return snapshot.docs.map((d) => d.data());
}

export async function batchSetStreets2(streets: any[]) {
  // let batch = writeBatch(db);
  // eslint-disable-next-line guard-for-in, no-restricted-syntax
  for (const index in streets) {
    // eslint-disable-next-line no-await-in-loop
    const street = {
      name: streets[index].typo_min,
      parisDataInfo: {
        id: streets[index].id ?? null,
        codeVDP: streets[index].cvoie ?? null,
        codeDGFIP: streets[index].cdgi ?? null,
        decreeDate: streets[index].date_arret ?? null,
        century: streets[index].siecle ?? null,
        status: streets[index].statut ?? null,
        type: streets[index].typvoie ?? null,
        prepositionStreet: streets[index].prevoie ?? null,
        nameStreet: streets[index].nomvoie ?? null,
        district: streets[index].arrdt.split(',') ?? null,
        subDistrict: streets[index].quartier ?? null,
        parcel: streets[index].feuille ?? null,
        streetStart: streets[index].debut ?? null,
        streetEnd: streets[index].fin ?? null,
        length: streets[index].longueur ?? null,
        width: streets[index].largeur ?? null,
        alignement: streets[index].alignement ?? null,
        easement: streets[index].servitude ?? null,
        history: streets[index].historique ?? null,
        naming: streets[index].denomination ?? null,
        classification: streets[index].classement ?? null,
        declassification: streets[index].declassement ?? null,
        observation: streets[index].observation ?? null,
        nameOrigin: streets[index].orig ?? null,
        leveling: streets[index].nivellement ?? null,
        sanitation: streets[index].assainissement ?? null,
        opening: streets[index].ouverture ?? null,
        coords: streets[index].geo_shape ? JSON.stringify(streets[index].geo_shape) : null,
        coords2D: streets[index].geo_point_2d ? JSON.stringify(streets[index].geo_point_2d) : null,
      },
      length: {
        value: streets[index].longueur ?? null,
        lastUpdate: null,
        source: null,
        type: null,
      },
      width: {
        value: streets[index].largeur ?? null,
        lastUpdate: null,
        source: null,
        type: null,
      },
      coords: JSON.stringify(streets[index].linearCoords || streets[index].geo_shape),
    };
    addDoc(collection(db, 'streets-3'), street);
  }
}

export async function getStreetsDocs(): Promise<Street[]> {
  const snapshot = await getDocs(
    query(
      collection(db, STREET_COLLECTION),
      // where('parisDataInfo.district', 'array-contains-any', ['01e', '16e', '19e']),
      limit(TOP),
    ).withConverter(new StreetConverter()),
  );
  const subItemsSnapshot = await getDocs(
    query(collection(db, 'streetSubItems')).withConverter(new StreetSubItemConverter()),
  );
  return snapshot.docs
    .map((d) => {
      const street = d.data();
      return {
        ...street,
        subItems: street.subIds
          .map((subId) =>
            subItemsSnapshot.docs.find((subItem) => subItem.data().id === subId)?.data(),
          )
          .filter((e) => !!e) as SubItem[],
      };
    })
    .sort((e1, e2) => (e1.parisDataInfo.nameStreet > e2.parisDataInfo.nameStreet ? 1 : -1));
}

export async function getStreetSubItemsDocs(): Promise<SubItem[]> {
  const snapshot = await getDocs(
    query(collection(db, 'streetSubItems'), limit(TOP)).withConverter(new StreetSubItemConverter()),
  );
  return snapshot.docs.map((d) => d.data()).sort((si1, si2) => (si1.name > si2.name ? 1 : -1));
}

export async function getStreetSubItemDoc(id: string): Promise<SubItem> {
  const snapshot = await getDoc(
    doc(db, 'streetSubItems', id).withConverter(new StreetSubItemConverter()),
  );
  return snapshot.data()!;
}

export async function getStreetDoc(id: string): Promise<Street> {
  const snapshot = await getDoc(
    doc(db, STREET_COLLECTION, id).withConverter(new StreetConverter()),
  );
  const street = snapshot.data()!;
  const subItems = (
    await Promise.all(street.subIds.map(async (subId) => getStreetSubItemDoc(subId)))
  ).filter((e) => !!e);
  return { ...street, subItems };
}

export async function getStreetSubDoc(id: string): Promise<SubItem> {
  const snapshot = await getDoc(
    doc(db, 'streetSubItems', id).withConverter(new StreetSubItemConverter()),
  );
  return snapshot.data()!;
}
export async function setStreetDoc(street: Street): Promise<void> {
  await setDoc(doc(db, STREET_COLLECTION, street.id).withConverter(new StreetConverter()), street);
}

export async function setSubItemDoc(subItem: SubItem): Promise<string> {
  if (subItem.id) {
    await setDoc(
      doc(db, 'streetSubItems', subItem.id).withConverter(new StreetSubItemConverter()),
      subItem,
    );
    return subItem.id;
  }
  return (
    await addDoc(
      collection(db, 'streetSubItems').withConverter(new StreetSubItemConverter()),
      subItem,
    )
  ).id;
}
