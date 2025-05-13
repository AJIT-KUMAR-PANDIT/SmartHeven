import PouchDB from 'pouchdb';
import { signal } from "@maverick-js/signals";
import { Capacitor } from "@capacitor/core";
import { Filesystem, FilesystemDirectory } from "@capacitor/filesystem";

// Enable WebSQL adapter for native platforms if needed
if (Capacitor.isNativePlatform()) {
  const SQLiteAdapterFactory = require('pouchdb-adapter-node-websql').default;
  PouchDB.adapter('websql', SQLiteAdapterFactory);
}

// Collection holders - now PouchDB instances
let collections = {
  devices: null,
  rooms: null,
  scenes: null,
  automations: null,
  history: null,
  settings: null,
};

// Reactive signals
const devicesSignal = signal([]);
const roomsSignal = signal([]);
const scenesSignal = signal([]);
const automationsSignal = signal([]);
const historySignal = signal([]);
const settingsSignal = signal({});

// Map signals for easier refresh
const signalMap = {
  devices: devicesSignal,
  rooms: roomsSignal,
  scenes: scenesSignal,
  automations: automationsSignal,
  history: historySignal,
  settings: settingsSignal,
};

// Refresh signal after DB change
async function refreshSignal(collectionName) {
  const db = collections[collectionName];
  if (!db) return;

  const result = await db.allDocs({ include_docs: true });
  const data = result.rows.map(row => row.doc);

  if (collectionName === "settings") {
    signalMap[collectionName].value = data[0] || {};
  } else {
    signalMap[collectionName].value = data;
  }
}

// Initialize PouchDB
export async function initDatabase() {
  try {
    let adapter = Capacitor.isNativePlatform() ? 'websql' : 'indexeddb';

    const dbOptions = {
      adapter: adapter
    };
    

    // Init collections
    collections.devices = new PouchDB('devices', dbOptions);
    collections.rooms = new PouchDB('rooms', dbOptions);
    collections.scenes = new PouchDB('scenes', dbOptions);
    collections.automations = new PouchDB('automations', dbOptions);
    collections.history = new PouchDB('history', dbOptions);
    collections.settings = new PouchDB('settings', dbOptions);

    // Load initial signals
    await Promise.all(
      Object.keys(collections).map((key) => refreshSignal(key))
    );

    return collections;
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
}

// Get all items with pagination
export async function getAllItems(collectionName, page = 1, pageSize = 10) {
  const db = collections[collectionName];
  if (!db) return [];

  const result = await db.allDocs({ include_docs: true });
  const allItems = result.rows.map(row => row.doc);

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return allItems.slice(startIndex, endIndex);
}

// Get item by ID
export async function getItem(collectionName, id) {
  const db = collections[collectionName];
  if (!db) return null;

  try {
    return await db.get(id);
  } catch (error) {
    console.error(`Failed to get item from ${collectionName}:`, error);
    return null;
  }
}

// Save or update item
export async function save(collectionName, id, item) {
  const db = collections[collectionName];
  if (!db) return null;

  try {
    const doc = { ...item };
    if (!doc._id && collectionName !== "settings") {
      doc._id = id;
    }

    // If exists, fetch rev before updating
    try {
      const existing = await db.get(doc._id);
      doc._rev = existing._rev;
    } catch {}

    await db.put(doc);
    await refreshSignal(collectionName);
    return doc;
  } catch (error) {
    console.error(`Failed to save item to ${collectionName}:`, error);
    throw error;
  }
}

// Delete item
export async function deleteItem(collectionName, id) {
  const db = collections[collectionName];
  if (!db) return false;

  try {
    const doc = await db.get(id);
    await db.remove(doc);
    await refreshSignal(collectionName);
    return true;
  } catch (error) {
    console.error(`Failed to delete item from ${collectionName}:`, error);
    throw error;
  }
}

// Toggle device status
export async function toggleDevice(deviceId) {
  const db = collections.devices;
  if (!db) return null;

  try {
    const device = await db.get(deviceId);
    const newStatus = device.status === "on" ? "off" : "on";
    const updatedDevice = { ...device, status: newStatus };

    await db.put(updatedDevice);
    await refreshSignal("devices");
    return updatedDevice;
  } catch (error) {
    console.error("Failed to toggle device status:", error);
    throw error;
  }
}

// Reset all data
export async function resetDatabase() {
  try {
    for (const name in collections) {
      await collections[name].destroy();
      const db = collections[name] = new PouchDB(name, {
        adapter: collections[name].adapter
      });
      await refreshSignal(name);
    }
  } catch (error) {
    console.error("Failed to reset database:", error);
    throw error;
  }
}

// Clear specific collection
export async function clearCollection(collectionName) {
  const db = collections[collectionName];
  if (!db) return;

  try {
    const result = await db.allDocs({ include_docs: true });
    const docs = result.rows.map(row => ({ ...row.doc, _deleted: true }));
    await db.bulkDocs(docs);
    await refreshSignal(collectionName);
  } catch (error) {
    console.error(`Failed to clear collection ${collectionName}:`, error);
    throw error;
  }
}

// Export signals for components
export {
  devicesSignal,
  roomsSignal,
  scenesSignal,
  automationsSignal,
  historySignal,
  settingsSignal,
};