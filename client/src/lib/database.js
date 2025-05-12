import localforage from 'localforage';

/**
 * SimpleJsonDB - A lightweight JSON-like database for IoT applications
 * Works with both web and Capacitor mobile apps
 */
class SimpleJsonDB {
  constructor() {
    this.stores = {};
    this.initialized = false;
  }

  /**
   * Initialize the database
   */
  async init() {
    try {
      if (this.initialized) return true;

      // Configure the main database
      localforage.config({
        name: 'smartHavenDB',
        version: 1.0,
        storeName: 'core_data',
        description: 'SmartHaven IoT JSON Database'
      });

      // Create stores for different data types
      const storeNames = ['devices', 'rooms', 'scenes', 'automations', 'settings', 'history'];
      
      for (const store of storeNames) {
        this.stores[store] = localforage.createInstance({
          name: 'smartHavenDB',
          storeName: store
        });
        
        // Check if we need to initialize the store with default data
        const count = await this.getItemCount(store);
        if (count === 0) {
          // Only initialize devices and rooms with sample data
          if (store === 'devices' || store === 'rooms') {
            await this.initializeStoreData(store);
          }
        }
      }
      
      this.initialized = true;
      console.log('✅ JSON Database initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize database:', error);
      return false;
    }
  }
  
  /**
   * Get the number of items in a store
   * @param {string} storeName - Name of the store
   * @returns {number} - Number of items
   */
  async getItemCount(storeName) {
    let count = 0;
    
    // Make sure we have the store
    if (!this.stores[storeName]) return 0;
    
    await this.stores[storeName].iterate(() => {
      count++;
    });
    
    return count;
  }
  
  /**
   * Initialize a store with sample data
   * @param {string} storeName - Name of the store to initialize
   */
  async initializeStoreData(storeName) {
    try {
      if (storeName === 'devices') {
        // Load sample devices from deviceData.js
        const { devices } = await import('./deviceData.js');
        for (const device of devices) {
          await this.setItem(storeName, device.id, {
            ...device,
            lastUpdated: Date.now()
          });
        }
        console.log(`✅ Initialized ${devices.length} devices`);
      } 
      
      if (storeName === 'rooms') {
        // Load sample rooms from constants.js
        const { rooms } = await import('./constants.js');
        for (const room of rooms) {
          await this.setItem(storeName, room.id, {
            id: room.id,
            name: room.name,
            type: room.type || 'room',
            floor: room.floor || 1,
            icon: room.icon || 'home',
            devices: room.devices || []
          });
        }
        console.log(`✅ Initialized ${rooms.length} rooms`);
      }
    } catch (error) {
      console.error(`❌ Error initializing ${storeName} data:`, error);
    }
  }
  
  /**
   * Store an item in the database
   * @param {string} storeName - Store to use (devices, rooms, etc.)
   * @param {string} id - Unique identifier for the item
   * @param {object} data - Data to store (must be JSON serializable)
   */
  async setItem(storeName, id, data) {
    try {
      if (!this.stores[storeName]) {
        throw new Error(`Store "${storeName}" does not exist`);
      }
      
      // Save the data with the ID
      return await this.stores[storeName].setItem(id, data);
    } catch (error) {
      console.error(`❌ Error saving to ${storeName}:`, error);
      throw error;
    }
  }
  
  /**
   * Get an item from the database
   * @param {string} storeName - Store to use
   * @param {string} id - Item ID to retrieve
   * @returns {object|null} - Retrieved data or null if not found
   */
  async getItem(storeName, id) {
    try {
      if (!this.stores[storeName]) {
        throw new Error(`Store "${storeName}" does not exist`);
      }
      
      return await this.stores[storeName].getItem(id);
    } catch (error) {
      console.error(`❌ Error getting item from ${storeName}:`, error);
      return null;
    }
  }
  
  /**
   * Get all items from a store
   * @param {string} storeName - Store to use
   * @returns {Array} - Array of all items
   */
  async getAllItems(storeName) {
    try {
      if (!this.stores[storeName]) {
        throw new Error(`Store "${storeName}" does not exist`);
      }
      
      const items = [];
      await this.stores[storeName].iterate((value) => {
        items.push(value);
      });
      
      return items;
    } catch (error) {
      console.error(`❌ Error getting all items from ${storeName}:`, error);
      return [];
    }
  }
  
  /**
   * Delete an item from the database
   * @param {string} storeName - Store to use
   * @param {string} id - Item ID to delete
   * @returns {boolean} - Success status
   */
  async removeItem(storeName, id) {
    try {
      if (!this.stores[storeName]) {
        throw new Error(`Store "${storeName}" does not exist`);
      }
      
      await this.stores[storeName].removeItem(id);
      return true;
    } catch (error) {
      console.error(`❌ Error removing item from ${storeName}:`, error);
      return false;
    }
  }
  
  /**
   * Clear all items from a store
   * @param {string} storeName - Store to clear
   * @returns {boolean} - Success status
   */
  async clearStore(storeName) {
    try {
      if (!this.stores[storeName]) {
        throw new Error(`Store "${storeName}" does not exist`);
      }
      
      await this.stores[storeName].clear();
      return true;
    } catch (error) {
      console.error(`❌ Error clearing store ${storeName}:`, error);
      return false;
    }
  }
  
  /**
   * Filter items in a store based on criteria
   * @param {string} storeName - Store to query
   * @param {Function} filterFn - Filter function that returns true for items to include
   * @returns {Array} - Filtered array of items
   */
  async queryItems(storeName, filterFn) {
    try {
      const items = await this.getAllItems(storeName);
      return items.filter(filterFn);
    } catch (error) {
      console.error(`❌ Error querying ${storeName}:`, error);
      return [];
    }
  }
  
  /**
   * Generate a unique ID
   * @returns {string} - Unique ID
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
  
  /**
   * Update device status
   * @param {string} deviceId - Device ID
   * @param {object} updates - Properties to update
   * @returns {object|null} - Updated device object or null if failed
   */
  async updateDeviceStatus(deviceId, updates) {
    try {
      // Get current device
      const device = await this.getItem('devices', deviceId);
      
      if (!device) {
        console.error(`Device not found: ${deviceId}`);
        return null;
      }
      
      // Update device with new properties
      const updatedDevice = { 
        ...device, 
        ...updates, 
        lastUpdated: Date.now() 
      };
      
      // Save updated device
      await this.setItem('devices', deviceId, updatedDevice);
      
      // Record history for updated values
      for (const [key, value] of Object.entries(updates)) {
        if (key !== 'lastUpdated' && device[key] !== value) {
          await this.addHistory(deviceId, `changed_${key}`, value);
        }
      }
      
      return updatedDevice;
    } catch (error) {
      console.error(`❌ Error updating device ${deviceId}:`, error);
      return null;
    }
  }
  
  /**
   * Add a history entry
   * @param {string} deviceId - Device ID
   * @param {string} event - Event name
   * @param {any} value - Value associated with the event
   * @returns {object} - History entry
   */
  async addHistory(deviceId, event, value) {
    const historyId = this.generateId();
    const entry = {
      id: historyId,
      deviceId,
      event,
      value,
      timestamp: Date.now()
    };
    
    await this.setItem('history', historyId, entry);
    return entry;
  }
  
  /**
   * Get device history entries
   * @param {string} deviceId - Device ID
   * @param {number} limit - Maximum entries to return (0 for all)
   * @returns {Array} - Array of history entries
   */
  async getDeviceHistory(deviceId, limit = 0) {
    // Get all entries for this device
    const entries = await this.queryItems('history', item => item.deviceId === deviceId);
    
    // Sort by timestamp (newest first)
    entries.sort((a, b) => b.timestamp - a.timestamp);
    
    // Apply limit if provided
    if (limit > 0) {
      return entries.slice(0, limit);
    }
    
    return entries;
  }
  
  /**
   * Toggle a device on/off
   * @param {string} deviceId - Device ID
   * @returns {object|null} - Updated device object or null if failed
   */
  async toggleDevice(deviceId) {
    try {
      const device = await this.getItem('devices', deviceId);
      
      if (!device) {
        console.error(`Device not found: ${deviceId}`);
        return null;
      }
      
      const newStatus = device.status === 'on' ? 'off' : 'on';
      return await this.updateDeviceStatus(deviceId, { status: newStatus });
    } catch (error) {
      console.error(`❌ Error toggling device ${deviceId}:`, error);
      return null;
    }
  }
  
  /**
   * Get all devices in a room
   * @param {string} roomId - Room ID
   * @returns {Array} - Array of devices in the room
   */
  async getDevicesByRoom(roomId) {
    return await this.queryItems('devices', device => device.room === roomId);
  }
  
  /**
   * Create or update a scene
   * @param {object} scene - Scene object
   * @returns {object} - Saved scene
   */
  async saveScene(scene) {
    // Generate ID if needed
    if (!scene.id) {
      scene.id = this.generateId();
    }
    
    // Set defaults
    if (scene.isActive === undefined) scene.isActive = false;
    if (scene.lastTriggered === undefined) scene.lastTriggered = null;
    
    await this.setItem('scenes', scene.id, scene);
    return scene;
  }
  
  /**
   * Activate a scene (run all scene actions)
   * @param {string} sceneId - Scene ID
   * @returns {boolean} - Success status
   */
  async activateScene(sceneId) {
    try {
      const scene = await this.getItem('scenes', sceneId);
      
      if (!scene) {
        console.error(`Scene not found: ${sceneId}`);
        return false;
      }
      
      // Run all scene actions
      if (scene.actions && Array.isArray(scene.actions)) {
        for (const action of scene.actions) {
          if (action.deviceId && action.changes) {
            await this.updateDeviceStatus(action.deviceId, action.changes);
          }
        }
      }
      
      // Update scene status
      scene.isActive = true;
      scene.lastTriggered = Date.now();
      await this.setItem('scenes', sceneId, scene);
      
      return true;
    } catch (error) {
      console.error(`❌ Error activating scene ${sceneId}:`, error);
      return false;
    }
  }
  
  /**
   * Save a user setting
   * @param {string} key - Setting key
   * @param {any} value - Setting value
   * @returns {object} - Saved setting
   */
  async saveSetting(key, value) {
    const setting = { id: key, value, updatedAt: Date.now() };
    await this.setItem('settings', key, setting);
    return setting;
  }
  
  /**
   * Get a user setting
   * @param {string} key - Setting key
   * @param {any} defaultValue - Default value if setting not found
   * @returns {any} - Setting value or default
   */
  async getSetting(key, defaultValue = null) {
    const setting = await this.getItem('settings', key);
    return setting ? setting.value : defaultValue;
  }
}

// Create and export a single instance
const jsonDB = new SimpleJsonDB();

export default jsonDB;

// No default export here as we'll export jsonDB below