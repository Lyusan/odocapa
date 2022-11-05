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

export interface StreetSubItemPerson {
  id: string;
  name: string;
  birthday: string;
  deathday: string;
  gender: string;
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
    return { id: snapshot.id, ...data } as StreetSubItemPerson;
  }
}

export interface Street {
  id: string;
  name: string;
  lastUpdate: string;
  typeOfName: string;
  nameOrigin: string;
  nameDescription: string;
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
    return { id: snapshot.id, ...data } as Street;
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

export async function getStreetSubItemsDocs(type: string): Promise<StreetSubItemPerson[]> {
  const snapshot = await getDocs(
    query(collection(db, 'streetSubItems'), where('type', '==', type), limit(50)).withConverter(
      new StreetSubItemPersonConverter(),
    ),
  );
  return snapshot.docs.map((d) => d.data());
}

export async function getStreetDoc(id: string): Promise<Street> {
  const snapshot = await getDoc(doc(db, 'streets', id).withConverter(new StreetConverter()));
  return snapshot.data()!;
}

export async function setStreetDoc(street: Street): Promise<void> {
  await setDoc(doc(db, 'streets', street.id).withConverter(new StreetConverter()), street);
}
