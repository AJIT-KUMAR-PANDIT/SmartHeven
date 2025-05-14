import BaseDB from "./base.db.js";
import { v4 as uuidv4 } from "uuid";

class SceneDB extends BaseDB {
  constructor() {
    super({ scenes: {} });
    this.collection = "scenes";
  }

  async getAllItems() {
    const scenes = await super.getAllItems(this.collection);
    return Object.values(scenes);
  }

  async getById(id) {
    const scenes = await super.getAllItems(this.collection);
    return scenes[id];
  }

  async save(id, data) {
    if (!data.id) {
      data.id = id;
    }
    if (!data.createdAt) {
      data.createdAt = Date.now();
    }
    data.updatedAt = Date.now();

    return super.save(this.collection, id, data);
  }

  async remove(id) {
    return super.remove(this.collection, id);
  }

  generateId() {
    return uuidv4();
  }
}

export default new SceneDB();
