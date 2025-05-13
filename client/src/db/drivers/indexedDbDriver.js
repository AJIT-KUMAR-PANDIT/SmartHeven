export function indexedDbDriver(options = {}) {
  const {
    base = "",
    dbName = "nakprc-smarthaven-db",
    storeName = "nakprc-smarthaven-store",
  } = options;

  // Helper to open IndexedDB with proper upgrade handling
  function openDb() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName);
        }
      };
      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = () => reject("Failed to open IndexedDB");
    });
  }

  return {
    name: "indexeddb",
    async getItems() {
      const db = await openDb();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);
        const items = {};

        const getAllRequest = store.getAll();
        getAllRequest.onsuccess = () => {
          getAllRequest.result.forEach((item) => {
            items[item.key] = item.value;
          });
          resolve(items);
        };
        getAllRequest.onerror = () => reject("Failed to get all items");
      });
    },
    async setItem(key, value) {
      const db = await openDb();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        store.put({ key, value }, key);
        tx.oncomplete = resolve;
        tx.onerror = () => reject("Transaction failed");
      });
    },
    async getItem(key) {
      const db = await openDb();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);
        const getRequest = store.get(key);
        getRequest.onsuccess = () => resolve(getRequest.result?.value ?? null);
        getRequest.onerror = () => reject("Failed to get item");
      });
    },
    async removeItem(key) {
      const db = await openDb();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        store.delete(key);
        tx.oncomplete = resolve;
        tx.onerror = () => reject("Failed to delete item");
      });
    },
    async clear() {
      const db = await openDb();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        const clearRequest = store.clear();
        clearRequest.onsuccess = resolve;
        clearRequest.onerror = () => reject("Failed to clear storage");
      });
    },
  };
}
