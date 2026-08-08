import { openDB, DBSchema, IDBPDatabase } from 'https://esm.sh/idb@8.0.0';

const DB_NAME = 'AnimalWorldDB';
const FILE_STORE = 'fileStore';
const META_STORE = 'metaStore';
const DB_VERSION = 1;

interface AnimalWorldDBSchema extends DBSchema {
  [FILE_STORE]: {
    key: string;
    value: Blob;
  };
  [META_STORE]: {
    key: string;
    value: any;
  };
}

let dbPromise: Promise<IDBPDatabase<AnimalWorldDBSchema>> | null = null;

const getDb = (): Promise<IDBPDatabase<AnimalWorldDBSchema>> => {
  if (!dbPromise) {
    dbPromise = openDB<AnimalWorldDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(FILE_STORE)) {
          db.createObjectStore(FILE_STORE);
        }
        if (!db.objectStoreNames.contains(META_STORE)) {
          db.createObjectStore(META_STORE);
        }
      },
    });
  }
  return dbPromise;
};

export async function saveFile(path: string, blob: Blob): Promise<void> {
  const db = await getDb();
  await db.put(FILE_STORE, blob, path);
}

export async function getFile(path: string): Promise<Blob | undefined> {
  const db = await getDb();
  return db.get(FILE_STORE, path);
}

export async function saveMetadata(key: string, value: any): Promise<void> {
  const db = await getDb();
  await db.put(META_STORE, value, key);
}

export async function getMetadata<T>(key: string): Promise<T | undefined> {
  const db = await getDb();
  return db.get(META_STORE, key);
}
