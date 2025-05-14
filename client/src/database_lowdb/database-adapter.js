import { openDB } from "idb";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Capacitor } from "@capacitor/core";

const isMobile = () => {
  try {
    return Capacitor?.isNativePlatform?.();
  } catch {
    return false;
  }
};

// Adapter for Capacitor (Mobile)
export class CapacitorAdapter {
  constructor(filename = "nakprc-db.json") {
    this.filename = filename;
  }

  async read() {
    try {
      const result = await Filesystem.readFile({
        path: this.filename,
        directory: Directory.Data,
      });
      return JSON.parse(result.data);
    } catch {
      return null;
    }
  }

  async write(data) {
    await Filesystem.writeFile({
      path: this.filename,
      data: JSON.stringify(data),
      directory: Directory.Data,
      encoding: "utf8",
    });
  }
}

// Adapter for IndexedDB (Web)
export class IndexedDBAdapter {
  constructor(dbName = "lowdb", storeName = "main") {
    this.dbName = dbName;
    this.storeName = storeName;
  }

  async _initDB() {
    return openDB(this.dbName, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("main")) {
          db.createObjectStore("main");
        }
      },
    });
  }

  async read() {
    const db = await this._initDB();
    const result = await db.get("main", "data");
    return result || null;
  }

  async write(data) {
    const db = await this._initDB();
    await db.put("main", data, "data");
  }
}

// Select proper adapter
const adapter = isMobile() ? new CapacitorAdapter() : new IndexedDBAdapter();

export default adapter;
