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
    if (typeof url !== "string") {
      throw new Error("URL must be a string");
    }

    try {
      // Validate the URL format before saving
      if (!url.match(/^https?:\/\/.+/)) {
        throw new Error("URL must start with http:// or https://");
      }

      const settings = { iotUrl: url };
      await super.save(this.collection, "settings", settings);
      this.notifySubscribers(settings);
      return url;
    } catch (error) {
      console.error("Failed to save IoT URL:", error);
      throw error;
    }
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
