import { createDatabase, defineTable, defineSchema } from "@signaldb/core";
import { signal } from "@maverick-js/signals";

// Define schemas for collections
const deviceSchema = defineSchema({
  id: "string",
  name: "string",
  type: "string",
  room: "string",
  status: "string",
  value: "number?",
  battery: "number?",
  lastUpdated: "number?",
  connected: "boolean?",
  firmware: "string?",
  settings: "object?",
});

const roomSchema = defineSchema({
  id: "string",
  name: "string",
  type: "string",
  floor: "number?",
  icon: "string?",
  devices: "string[]",
});

const sceneSchema = defineSchema({
  id: "string",
  name: "string",
  icon: "string?",
  actions: {
    type: "array",
    items: {
      deviceId: "string",
      changes: {
        status: "string", // 'on', 'off', 'toggle'
      },
    },
  },
  isActive: "boolean?",
  lastTriggered: "number?",
});

const automationSchema = defineSchema({
  id: "string",
  name: "string",
  trigger: "object?",
  actions: {
    type: "array",
    items: {
      deviceId: "string",
      changes: {
        status: "string", // 'on', 'off', 'toggle'
      },
    },
  },
  isEnabled: "boolean?",
  lastTriggered: "number?",
});

const historySchema = defineSchema({
  id: "string",
  deviceId: "string",
  event: "string",
  value: "string?",
  timestamp: "number",
  user: "string?",
});

const settingsSchema = defineSchema({
  key: "string",
  value: "object?",
  updatedAt: "number?",
});

// Define tables
const devicesTable = defineTable("devices", deviceSchema);
const roomsTable = defineTable("rooms", roomSchema);
const scenesTable = defineTable("scenes", sceneSchema);
const automationsTable = defineTable("automations", automationSchema);
const historyTable = defineTable("history", historySchema);
const settingsTable = defineTable("settings", settingsSchema);

// Create database instance
const db = createDatabase({
  name: "smarthome_signaldb",
  tables: [
    devicesTable,
    roomsTable,
    scenesTable,
    automationsTable,
    historyTable,
    settingsTable,
  ],
});

// Signals for reactive state
const devicesSignal = signal([]);
const roomsSignal = signal([]);
const scenesSignal = signal([]);
const automationsSignal = signal([]);
const historySignal = signal([]);
const settingsSignal = signal({});

// Initialize database and load initial data
export async function initDatabase() {
  await db.open();

  // Load initial data into signals
  devicesSignal.value = await db.devices.toArray();
  roomsSignal.value = await db.rooms.toArray();
  scenesSignal.value = await db.scenes.toArray();
  automationsSignal.value = await db.automations.toArray();
  historySignal.value = await db.history.toArray();
  settingsSignal.value = await db.settings.toArray();
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
      return settingsSignal.value;
    default:
      return [];
  }
}

// Get single item by id
export async function getItem(collectionName, id) {
  return await db[collectionName].get(id);
}

// Save or update an item
export async function save(collectionName, id, item) {
  if (!item.id && collectionName !== "settings") {
    item.id = id;
  }
  await db[collectionName].put(item);

  // Update signals
  switch (collectionName) {
    case "devices":
      devicesSignal.value = await db.devices.toArray();
      break;
    case "rooms":
      roomsSignal.value = await db.rooms.toArray();
      break;
    case "scenes":
      scenesSignal.value = await db.scenes.toArray();
      break;
    case "automations":
      automationsSignal.value = await db.automations.toArray();
      break;
    case "history":
      historySignal.value = await db.history.toArray();
      break;
    case "settings":
      settingsSignal.value = await db.settings.toArray();
      break;
  }
  return item;
}

// Delete an item
export async function deleteItem(collectionName, id) {
  await db[collectionName].delete(id);

  // Update signals
  switch (collectionName) {
    case "devices":
      devicesSignal.value = await db.devices.toArray();
      break;
    case "rooms":
      roomsSignal.value = await db.rooms.toArray();
      break;
    case "scenes":
      scenesSignal.value = await db.scenes.toArray();
      break;
    case "automations":
      automationsSignal.value = await db.automations.toArray();
      break;
    case "history":
      historySignal.value = await db.history.toArray();
      break;
    case "settings":
      settingsSignal.value = await db.settings.toArray();
      break;
  }
  return true;
}

// Toggle device status
export async function toggleDevice(deviceId) {
  const device = await db.devices.get(deviceId);
  if (!device) return null;
  const newStatus = device.status === "on" ? "off" : "on";
  const updatedDevice = { ...device, status: newStatus };
  await db.devices.put(updatedDevice);
  devicesSignal.value = await db.devices.toArray();
  return updatedDevice;
}

// Reset database (delete all data)
export async function resetDatabase() {
  await Promise.all([
    db.devices.clear(),
    db.rooms.clear(),
    db.scenes.clear(),
    db.automations.clear(),
    db.history.clear(),
    db.settings.clear(),
  ]);
  window.location.reload();
}
