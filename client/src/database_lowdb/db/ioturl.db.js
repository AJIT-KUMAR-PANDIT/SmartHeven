import BaseDB from "./base.db.js";
import { v4 as uuidv4 } from "uuid";

class IotUrlDB extends BaseDB {
  constructor() {
    super({ urls: {} });
    this.collection = "urls";
  }

  async getAllItems() {
    const urls = await super.getAllItems(this.collection);
    return Object.values(urls);
  }

  async getById(id) {
    const urls = await super.getAllItems(this.collection);
    return urls[id];
  }

  async save(id, data) {
    if (!data.id) {
      data.id = id;
    }
    if (!data.createdAt) {
      data.createdAt = Date.now();
    }
    data.updatedAt = Date.now();

    // Validate URL format before saving
    if (!this.isValidUrl(data.url)) {
      throw new Error("Invalid URL format");
    }

    return super.save(this.collection, id, data);
  }

  async remove(id) {
    return super.remove(this.collection, id);
  }

  generateId() {
    return uuidv4();
  }

  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }

  async getUrlsByType(type) {
    const urls = await this.getAllItems();
    return urls.filter((url) => url.type === type);
  }
}

export default new IotUrlDB();
