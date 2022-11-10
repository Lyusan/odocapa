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
import { TtTt } from '../helper/map';
import { DEFAULT_STREET, MinimalStreet, Street } from '../type/Street';
import { DEFAULT_STREET_SUB_ITEM, MinimalStreetSub, StreetSubItemPerson } from '../type/SubItem';

const firebaseApp = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
});
const db = getFirestore(firebaseApp);

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
      batch.set(doc(db, 'streets', h), street);
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

export async function getStreetSubDoc(id: string): Promise<StreetSubItemPerson> {
  const snapshot = await getDoc(
    doc(db, 'streetSubItems', id).withConverter(new StreetSubItemPersonConverter()),
  );
  return snapshot.data()!;
}
export async function setStreetDoc(street: Street): Promise<void> {
  await setDoc(doc(db, 'streets', street.id).withConverter(new StreetConverter()), street);
}

export async function setSubItemDoc(subItem: StreetSubItemPerson): Promise<string> {
  if (subItem.id) {
    await setDoc(
      doc(db, 'streetSubItems', subItem.id).withConverter(new StreetSubItemPersonConverter()),
      subItem,
    );
    return subItem.id;
  }
  return (
    await addDoc(
      collection(db, 'streetSubItems').withConverter(new StreetSubItemPersonConverter()),
      subItem,
    )
  ).id;
}
