// eslint-disable-next-line max-classes-per-file
import {
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
import { TtTt } from '../helper/map';

const firebaseApp = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
});
const db = getFirestore(firebaseApp);

async function digestMessage(message: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const encodedHash = await crypto.subtle.digest('SHA-256', data);
  const hash = Array.from(new Uint8Array(encodedHash))
    .map((bytes) => bytes.toString(16).padStart(2, '0'))
    .join('');
  return hash;
}

export const DEFAULT_DATA_PROPERTY = {
  value: '',
  lastUpdate: null,
  source: null,
  type: null,
};

export enum DataPropertyType {
  COPY = 'copy_from_source',
  COPY_EDITED = 'edited_from_source',
  CUSTOM = 'custom',
}

export interface DataProperty {
  value: string;
  lastUpdate: Date | null;
  source: string | null;
  type: DataPropertyType | null;
}

export const DEFAULT_SUB_ITEM = {
  id: null,
  lastUpdate: null,
  name: DEFAULT_DATA_PROPERTY,
  description: DEFAULT_DATA_PROPERTY,
};

export const DEFAULT_STREET_SUB_ITEM = {
  ...DEFAULT_SUB_ITEM,
  birthday: DEFAULT_DATA_PROPERTY,
  deathday: DEFAULT_DATA_PROPERTY,
  gender: DEFAULT_DATA_PROPERTY,
};

export interface StreetSubItemPerson {
  id: string | null;
  lastUpdate: Date | null;

  name: DataProperty;
  description: DataProperty;
  birthday: DataProperty;
  deathday: DataProperty;
  gender: DataProperty;
}
export interface MinimalStreetSub {
  id: string;
  name: string;
}

/* eslint-disable class-methods-use-this */
export class MinimalStreetSubConverter implements FirestoreDataConverter<MinimalStreetSub> {
  toFirestore(): DocumentData {
    throw new Error('This is not supported');
  }

  fromFirestore(snapshot: QueryDocumentSnapshot): MinimalStreetSub {
    const data = snapshot.data()!;
    return { name: data.name.value, id: snapshot.id } as MinimalStreetSub;
  }
}

/* eslint-disable class-methods-use-this */
export class StreetSubItemPersonConverter implements FirestoreDataConverter<StreetSubItemPerson> {
  toFirestore(street: StreetSubItemPerson): DocumentData {
    const data = { ...street } as any;
    delete data.id;
    return data;
  }

  fromFirestore(snapshot: QueryDocumentSnapshot): StreetSubItemPerson {
    const data = snapshot.data()!;
    return { ...DEFAULT_STREET_SUB_ITEM, ...data, id: snapshot.id } as StreetSubItemPerson;
  }
}

export const DEFAULT_STREET = {
  lastUpdate: null,
  typeOfName: {
    value: 'Personne',
    lastUpdate: null,
    source: null,
    type: null,
  },
  nameOrigin: DEFAULT_DATA_PROPERTY,
  nameDescription: DEFAULT_DATA_PROPERTY,
};

export interface Street {
  id: string;
  name: string;
  lastUpdate: Date | null;
  typeOfName: DataProperty;
  nameOrigin: DataProperty;
  nameDescription: DataProperty;
  coords: string;
  subId: string | null;
}

/* eslint-disable class-methods-use-this */
export class StreetConverter implements FirestoreDataConverter<Street> {
  toFirestore(street: Street): DocumentData {
    const data = { ...street } as any;
    delete data.id;
    return data;
  }

  fromFirestore(snapshot: QueryDocumentSnapshot): Street {
    const data = snapshot.data()!;
    return { id: snapshot.id, ...DEFAULT_STREET, ...data } as Street;
  }
}

export class MinimalStreet {
  id: string;

  name: string;

  lastUpdate: string;

  constructor(id: string, name: string, lastUpdate: string) {
    this.id = id;
    this.name = name;
    this.lastUpdate = lastUpdate;
  }

  toString() {
    return `MinimalStreet: ${this.id}, ${this.name}`;
  }
}

/* eslint-disable class-methods-use-this */
export class MinimalStreetConverter implements FirestoreDataConverter<MinimalStreet> {
  toFirestore(street: MinimalStreet): DocumentData {
    return { id: street.id, name: street.name, lastUpdate: street.lastUpdate };
  }

  fromFirestore(snapshot: QueryDocumentSnapshot): MinimalStreet {
    const data = snapshot.data()!;
    return new MinimalStreet(snapshot.id, data.name, data.lastUpdate);
  }
}

export async function batchSetStreets(streets: TtTt[]) {
  let batch = writeBatch(db);
  // eslint-disable-next-line guard-for-in, no-restricted-syntax
  for (const index in streets) {
    // eslint-disable-next-line no-await-in-loop
    const hash = await digestMessage(streets[index].name);
    const street = {
      name: streets[index].name,
      coords: JSON.stringify(streets[index].coords),
    };
    if (street.name !== undefined) {
      batch.set(doc(db, 'streets', hash), street);
    }
    if (Number(index) % 300 === 0) {
      // eslint-disable-next-line no-await-in-loop
      await batch.commit();
      batch = writeBatch(db);
    }
  }
}

export async function getStreetsDocs(): Promise<MinimalStreet[]> {
  const snapshot = await getDocs(
    query(collection(db, 'streets'), limit(50)).withConverter(new MinimalStreetConverter()),
  );
  return snapshot.docs.map((d) => d.data());
}

export async function getStreetSubItemsDocs(type: string): Promise<MinimalStreetSub[]> {
  const snapshot = await getDocs(
    query(collection(db, 'streetSubItems'), where('type', '==', type), limit(50)).withConverter(
      new MinimalStreetSubConverter(),
    ),
  );
  console.log(snapshot.docs.map((d) => d.data()));
  return snapshot.docs.map((d) => d.data());
}

export async function getStreetSubItemDoc(id: string): Promise<StreetSubItemPerson> {
  const snapshot = await getDoc(
    doc(db, 'streetSubItems', id).withConverter(new StreetSubItemPersonConverter()),
  );
  return snapshot.data()!;
}

export async function getStreetDoc(id: string): Promise<Street> {
  const snapshot = await getDoc(doc(db, 'streets', id).withConverter(new StreetConverter()));
  return snapshot.data()!;
}

export async function setStreetDoc(street: Street): Promise<void> {
  await setDoc(doc(db, 'streets', street.id).withConverter(new StreetConverter()), street);
}
