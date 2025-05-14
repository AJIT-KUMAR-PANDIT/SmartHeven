class CustomEventEmitter {
  constructor() {
    this.listeners = new Map();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((callback) => callback(data));
    }
  }
}

class Database {
  constructor(name) {
    this.name = name;
    this.data = {};
    this.eventEmitter = new CustomEventEmitter();
  }

  init() {
    try {
      const storedData = localStorage.getItem(this.name);
      this.data = storedData ? JSON.parse(storedData) : {};
    } catch (error) {
      console.error(`Error initializing ${this.name} database:`, error);
      this.data = {};
    }
  }

  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  async getAllItems(collection = "") {
    try {
      const key = collection || this.name;
      const storedData = localStorage.getItem(key);
      return storedData ? JSON.parse(storedData) : {};
    } catch (error) {
      console.error(`Error getting items from ${this.name}:`, error);
      return {};
    }
  }

  async save(id, data) {
    try {
      // Get current data
      const currentData = await this.getAllItems(this.name);

      // Update data
      const updatedData = {
        ...currentData,
        [id]: data,
      };

      // Save to localStorage
      localStorage.setItem(this.name, JSON.stringify(updatedData));

      // Emit change event
      this.eventEmitter.emit("change", updatedData);

      return true;
    } catch (error) {
      console.error(`Error saving to ${this.name}:`, error);
      return false;
    }
  }

  async delete(id) {
    try {
      const currentData = await this.getAllItems(this.name);
      delete currentData[id];

      localStorage.setItem(this.name, JSON.stringify(currentData));

      // Emit change event
      this.eventEmitter.emit("change", currentData);

      return true;
    } catch (error) {
      console.error(`Error deleting from ${this.name}:`, error);
      return false;
    }
  }

  // Subscribe to changes
  subscribe(callback) {
    this.eventEmitter.on("change", callback);
    return () => this.eventEmitter.off("change", callback);
  }
}

// Create database instances
export const RoomDB = new Database("rooms");
export const DeviceDB = new Database("devices");
export const SceneDB = new Database("scenes");
