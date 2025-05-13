const SceneDB = {
  async init() {
    // Initialization handled by lowdb
  },
  async getAllItems() {
    return await this.db.get('scenes').value();
  },
  async save(id, data) {
    await this.db.get('scenes').set(id, data).write();
    return data;
  },
  async remove(id) {
    await this.db.get('scenes').unset(id).write();
  },
  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
};

export default SceneDB;
