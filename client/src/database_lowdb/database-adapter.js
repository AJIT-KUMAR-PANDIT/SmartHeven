import { openDB } from "idb";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Capacitor } from "@capacitor/core";
import { Low } from "lowdb";
import { LocalStorage } from "lowdb/browser";

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
  constructor(dbName = "lowdb") {
    this.adapter = new LocalStorage(dbName);
    this.db = new Low(this.adapter, { rooms: [], devices: [] });
    this.db.data ||= { rooms: [], devices: [] };
  }

  async read() {
    await this.db.read();
    return this.db.data || null;
  }

  async write(data) {
    this.db.data = data;
    await this.db.write();
  }
}

// Select proper adapter
const adapter = isMobile() ? new CapacitorAdapter() : new IndexedDBAdapter();

export default adapter;
