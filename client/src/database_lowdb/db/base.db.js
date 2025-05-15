import { Low } from "lowdb";
import adapter from "../database-adapter.js";

class BaseDB {
  constructor(defaultData) {
    this.defaultData = defaultData;
    this.db = null;
    this.initialized = false;
  }

  async init() {
    if (!this.initialized) {
      this.db = new Low(adapter, this.defaultData);
      await this.db.read();
      this.initialized = true;
    }
    return this.db;
  }

  async getAllItems(collection) {
    if (!this.initialized) await this.init();
    return this.db.data[collection] || {};
  }

  async getById(collection, id) {
    if (!this.initialized) await this.init();
    return this.db.data[collection]?.[id] || null;
  }

  async save(collection, id, data) {
    if (!this.initialized) await this.init();
    if (!this.db.data[collection]) {
      this.db.data[collection] = {};
    }
    this.db.data[collection][id] = data;
    await this.db.write();
    return data;
  }

  async remove(collection, id) {
    if (!this.initialized) await this.init();
    if (this.db.data[collection] && this.db.data[collection][id]) {
      delete this.db.data[collection][id];
      await this.db.write();
    }
  }
}

export default BaseDB;