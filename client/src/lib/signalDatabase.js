// src/db/pouchdb.js
import PouchDB from "pouchdb-browser";
import pouchAsyncStorage from "pouchdb-adapter-asyncstorage";

// Register the asyncstorage adapter
PouchDB.plugin(pouchAsyncStorage);

// Choose the correct adapter based on environment
const getAdapter = () => {
  if (typeof window !== "undefined" && window?.cordova) {
    return "asyncstorage"; // Mobile (Capacitor)
  }
  return "idb"; // Web (IndexedDB)
};

const DB_OPTS = {
  adapter: getAdapter(),
};

// Create individual PouchDB instances per collection
const deviceDB = new PouchDB("devices", DB_OPTS);
const roomDB = new PouchDB("rooms", DB_OPTS);
const sceneDB = new PouchDB("scenes", DB_OPTS);
const automationDB = new PouchDB("automations", DB_OPTS);
const historyDB = new PouchDB("history", DB_OPTS);
const settingsDB = new PouchDB("settings", DB_OPTS);

// Signals for reactive state
export const devicesSignal = signal([]);
export const roomsSignal = signal([]);
export const scenesSignal = signal([]);
export const automationsSignal = signal([]);
export const historySignal = signal([]);
export const settingsSignal = signal({});

// Load initial data into signals
export async function initDatabase() {
  const loadDocs = async (db) => {
    const res = await db.allDocs({ include_docs: true });
    return res.rows.map((row) => row.doc);
  };

  devicesSignal.value = await loadDocs(deviceDB);
  roomsSignal.value = await loadDocs(roomDB);
  scenesSignal.value = await loadDocs(sceneDB);
  automationsSignal.value = await loadDocs(automationDB);
  historySignal.value = await loadDocs(historyDB);

  const settingsList = await loadDocs(settingsDB);
  const settingsMap = {};
  settingsList.forEach((s) => {
    if (s.key) settingsMap[s.key] = s;
  });
  settingsSignal.value = settingsMap;
}

// Get all items from a collection
export async function getAllItems(collectionName) {
  switch (collectionName) {
    case "devices":
      return devicesSignal.value;
    case "rooms":
      return roomsSignal.value;
    case "scenes":
      return scenesSignal.value;
    case "automations":
      return automationsSignal.value;
    case "history":
      return historySignal.value;
    case "settings":
      return Object.values(settingsSignal.value);
    default:
      return [];
  }
}

// Get single item by id
export async function getItem(collectionName, id) {
  const db = getDB(collectionName);
  try {
    return await db.get(id);
  } catch (err) {
    console.error(`Error fetching ${collectionName} with id ${id}:`, err);
    return null;
  }
}

// Save or update an item
export async function save(collectionName, id, item) {
  const db = getDB(collectionName);

  if (!item._id && !item.id && collectionName !== "settings") {
    item._id = id;
  } else if (!item._id) {
    item._id = id;
  }

  try {
    const existing = await db.get(item._id);
    item._rev = existing._rev;
  } catch (err) {
    // No existing doc — proceed without _rev
  }

  await db.put(item);
  await refreshSignals(collectionName);
  return item;
}

// Delete an item
export async function deleteItem(collectionName, id) {
  const doc = await getItem(collectionName, id);
  if (!doc) return false;

  const db = getDB(collectionName);
  await db.remove(doc);
  await refreshSignals(collectionName);
  return true;
}

// Toggle device status
export async function toggleDevice(deviceId) {
  const device = await deviceDB.get(deviceId);
  if (!device) return null;

  device.status = device.status === "on" ? "off" : "on";
  await deviceDB.put(device);
  await refreshSignals("devices");
  return device;
}

// Reset database (delete all data)
export async function resetDatabase() {
  const dbs = [deviceDB, roomDB, sceneDB, automationDB, historyDB, settingsDB];
  for (let db of dbs) {
    await db.destroy();
  }

  window.location.reload();
}

// --- Helper functions ---

function getDB(collectionName) {
  switch (collectionName) {
    case "devices":
      return deviceDB;
    case "rooms":
      return roomDB;
    case "scenes":
      return sceneDB;
    case "automations":
      return automationDB;
    case "history":
      return historyDB;
    case "settings":
      return settingsDB;
    default:
      throw new Error(`Unknown collection: ${collectionName}`);
  }
}

async function refreshSignals(collectionName) {
  const db = getDB(collectionName);
  const docs = await db
    .allDocs({ include_docs: true })
    .then((res) => res.rows.map((row) => row.doc));

  switch (collectionName) {
    case "devices":
      devicesSignal.value = docs;
      break;
    case "rooms":
      roomsSignal.value = docs;
      break;
    case "scenes":
      scenesSignal.value = docs;
      break;
    case "automations":
      automationsSignal.value = docs;
      break;
    case "history":
      historySignal.value = docs;
      break;
    case "settings":
      const settingsMap = {};
      docs.forEach((s) => {
        if (s.key) settingsMap[s.key] = s;
      });
      settingsSignal.value = settingsMap;
      break;
  }
}
