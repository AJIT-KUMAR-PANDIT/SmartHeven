import { Low } from "lowdb";
import { LocalStorage } from "lowdb/browser";

const baseSchema = {
  rooms: [],
  devices: [],
};

class DBAdapter {
  constructor(name) {
    const adapter = new LocalStorage(name);
    this.db = new Low(adapter, structuredClone(baseSchema));
    this.subscribers = new Set();
  }

  async init() {
    await this.db.read();
    this.db.data ||= structuredClone(baseSchema);
    await this.db.write();
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  async save(collection, id, data) {
    await this.db.read();
    const index = this.db.data[collection].findIndex((item) => item.id === id);

    if (index > -1) {
      this.db.data[collection][index] = data;
    } else {
      this.db.data[collection].push(data);
    }

    await this.db.write();
    this.notifySubscribers(collection);
  }

  async getAllItems(collection) {
    await this.db.read();
    return this.db.data[collection] || [];
  }

  generateId() {
    return crypto.randomUUID();
  }

  notifySubscribers(collection) {
    const data = this.db.data[collection];
    this.subscribers.forEach((cb) => cb(data));
  }
}

import SceneDB from "./db/scene.db.js";
import AutomationDB from "./db/automation.db.js";
import SettingsDB from "./db/settings.db.js";

export const RoomDB = new DBAdapter("rooms");
export const DeviceDB = new DBAdapter("devices");
export { SceneDB, AutomationDB, SettingsDB };
