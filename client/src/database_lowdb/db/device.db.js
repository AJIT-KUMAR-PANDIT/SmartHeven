import { v4 as uuidv4 } from "uuid";
import BaseDB from "./base.db.js";

class DeviceDB extends BaseDB {
  constructor() {
    super({ devices: {} });
  }

  async getAllItems() {
    return super.getAllItems("devices");
  }

  async save(id, data) {
    return super.save("devices", id, data);
  }

  async remove(id) {
    return super.remove("devices", id);
  }

  generateId() {
    return uuidv4();
  }
}

export default new DeviceDB();
