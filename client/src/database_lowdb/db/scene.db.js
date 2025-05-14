import { v4 as uuidv4 } from "uuid";
import BaseDB from "./base.db.js";

class SceneDB extends BaseDB {
  constructor() {
    super({ scenes: {} });
  }

  async getAllItems() {
    return super.getAllItems("scenes");
  }

  async save(id, data) {
    return super.save("scenes", id, data);
  }

  async remove(id) {
    return super.remove("scenes", id);
  }

  generateId() {
    return uuidv4();
  }
}

export default new SceneDB();
