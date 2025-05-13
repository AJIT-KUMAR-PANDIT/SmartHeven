const RoomDB = {
  async init() {
    // Initialization handled by lowdb
  },
  async getAllItems() {
    return await this.db.get('rooms').value();
  },
  async save(id, data) {
    await this.db.get('rooms').set(id, data).write();
    return data;
  },
  async remove(id) {
    await this.db.get('rooms').unset(id).write();
  },
  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
};

export default RoomDB;
