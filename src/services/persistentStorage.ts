export enum PERSISTENT_STORAGE_KEYS {
  GOALS = 'GOALS',
  HABITS = 'HABITS',
}

export interface IPersistentStorage {
  set: (key: PERSISTENT_STORAGE_KEYS, data: unknown) => void;
  get: (key: PERSISTENT_STORAGE_KEYS) => unknown;
  clear: () => void;
}

export class PersistentStorage implements IPersistentStorage {
  set = (key: PERSISTENT_STORAGE_KEYS, data: unknown) => {
    localStorage.setItem(key, JSON.stringify(data));
  }

  get = (key: PERSISTENT_STORAGE_KEYS) => {
    const data = localStorage.getItem(key);

    if (data) {
      return JSON.parse(data);
    }
  }

  clear = () => {
    localStorage.clear();
  }
}

const persistentStorage = new PersistentStorage();

export { persistentStorage };