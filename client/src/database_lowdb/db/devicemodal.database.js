const DeviceDB = {
  async init() {
    // Initialization handled by lowdb
  },
  async getAllItems() {
    return await this.db.get("devices").value();
  },
  async save(id, data) {
    await this.db.get("devices").set(id, data).write();
    return data;
  },
  async remove(id) {
    await this.db.get("devices").unset(id).write();
  },
  generateId() {
    return Math.random().toString(36).substr(2, 9);
  },
};

export default DeviceDB;
