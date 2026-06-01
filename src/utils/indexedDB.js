/**
 * FinSight Native IndexedDB Wrapper
 * Provides an asynchronous, promise-based API to manage local storage
 * without blocking the main UI thread, circumventing the 5MB localStorage limit.
 */

const DB_NAME = 'finsight_db';
const DB_VERSION = 1;
const STORE_NAME = 'settings_and_data';

/**
 * Initializes the IndexedDB database.
 * @returns {Promise<IDBDatabase>}
 */
export function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('IndexedDB failed to open:', event.target.error);
      reject(event.target.error);
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

/**
 * Retrieves a value from IndexedDB by key.
 * @param {string} key
 * @returns {Promise<any>}
 */
export async function getByKey(key) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(key);

    request.onsuccess = () => {
      resolve(request.result !== undefined ? request.result : null);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

/**
 * Saves a value in IndexedDB by key.
 * @param {string} key
 * @param {any} value
 * @returns {Promise<void>}
 */
export async function setByKey(key, value) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(value, key);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

/**
 * Deletes a key from IndexedDB.
 * @param {string} key
 * @returns {Promise<void>}
 */
export async function deleteByKey(key) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(key);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

/**
 * Clears all data inside the store.
 * @returns {Promise<void>}
 */
export async function clearAll() {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}
