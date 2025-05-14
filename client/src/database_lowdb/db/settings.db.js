import BaseDB from "./base.db.js";
import { nanoid } from "nanoid";

class SettingsDB extends BaseDB {
  constructor() {
    super({ settings: { iotUrl: "" } });
    this.collection = "settings";
    this.subscribers = new Set();
  }

  async getIotUrl() {
    const settings = await super.getAllItems(this.collection);
    return settings.iotUrl || "";
  }

  async setIotUrl(url) {
    const settings = await super.getAllItems(this.collection);
    settings.iotUrl = url;
    await super.save(this.collection, "iotUrl", settings);
    this.notifySubscribers(settings);
    return url;
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notifySubscribers(data) {
    for (const callback of this.subscribers) {
      callback(data);
    }
  }

  generateId() {
    return nanoid();
  }
}

export default new SettingsDB();