import BaseDB from "./base.db.js";
import { v4 as uuidv4 } from "uuid";

class RoomDB extends BaseDB {
  constructor() {
    super({ rooms: {} });
    this.collection = "rooms";
  }

  async getAllItems() {
    const rooms = await super.getAllItems(this.collection);
    return Object.values(rooms);
  }

  async getById(id) {
    const rooms = await super.getAllItems(this.collection);
    return rooms[id];
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

  async getRoomsByFloor(floor) {
    const rooms = await this.getAllItems();
    return rooms.filter((room) => room.floor === floor);
  }

  async getRoomsByType(type) {
    const rooms = await this.getAllItems();
    return rooms.filter((room) => room.type === type);
  }
}

export default new RoomDB();
