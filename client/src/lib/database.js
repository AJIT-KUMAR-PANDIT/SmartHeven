import { createRxDatabase, addRxPlugin } from "rxdb";
import { v4 as uuidv4 } from "uuid";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";

addRxPlugin(RxDBDevModePlugin);

const DB_NAME = "smarthome_rxdb";
let dbPromise = null;

export const generateId = () => uuidv4();

const deviceSchema = {
  title: "device schema",
  version: 0,
  description: "Describes a smart home device",
  type: "object",
  primaryKey: "id",
  properties: {
    id: { type: "string", maxLength: 100 },
    name: { type: "string" },
    type: { type: "string" },
    room: { type: "string" },
    status: { type: "string" },
    value: { type: ["number", "null"] },
    battery: { type: ["number", "null"] },
    lastUpdated: { type: ["number", "null"] },
    connected: { type: ["boolean", "null"] },
    firmware: { type: ["string", "null"] },
    settings: { type: ["object", "null"], default: null },
  },
  required: ["id", "name", "type", "room", "status"],
};

const roomSchema = {
  title: "room schema",
  version: 0,
  description: "Describes a room",
  type: "object",
  primaryKey: "id",
  properties: {
    id: { type: "string", maxLength: 100 },
    name: { type: "string" },
    type: { type: "string" },
    floor: { type: ["number", "null"] },
    icon: { type: ["string", "null"] },
    devices: {
      type: ["array", "null"],
      items: { type: "string" },
      default: [],
    },
  },
  required: ["id", "name", "type"],
};

const sceneSchema = {
  title: "scene schema",
  version: 0,
  description: "Describes a scene",
  type: "object",
  primaryKey: "id",
  properties: {
    id: { type: "string", maxLength: 100 },
    name: { type: "string" },
    icon: { type: ["string", "null"] },
    actions: {
      type: ["array", "null"],
      items: { type: "object" },
      default: [],
    },
    isActive: { type: ["boolean", "null"] },
    lastTriggered: { type: ["number", "null"] },
  },
  required: ["id", "name"],
};

const automationSchema = {
  title: "automation schema",
  version: 0,
  description: "Describes an automation",
  type: "object",
  primaryKey: "id",
  properties: {
    id: { type: "string", maxLength: 100 },
    name: { type: "string" },
    trigger: { type: ["object", "null"], default: null },
    actions: {
      type: ["array", "null"],
      items: { type: "object" },
      default: [],
    },
    isEnabled: { type: ["boolean", "null"] },
    lastTriggered: { type: ["number", "null"] },
  },
  required: ["id", "name"],
};

const historySchema = {
  title: "history schema",
  version: 0,
  description: "Describes a device history event",
  type: "object",
  primaryKey: "id",
  properties: {
    id: { type: "string", maxLength: 100 },
    deviceId: { type: "string" },
    event: { type: "string" },
    value: { type: ["string", "null"] },
    timestamp: { type: "number" },
    user: { type: ["string", "null"] },
  },
  required: ["id", "deviceId", "event", "timestamp"],
};

const settingsSchema = {
  title: "settings schema",
  version: 0,
  description: "Describes a settings entry",
  type: "object",
  primaryKey: "key",
  properties: {
    key: { type: "string", maxLength: 100 },
    value: { type: ["object", "null"], default: null },
    updatedAt: { type: ["number", "null"] },
  },
  required: ["key"],
};

async function getDb() {
  if (!dbPromise) {
    dbPromise = createRxDatabase({
      name: DB_NAME,
      storage: getRxStorageDexie(),
      multiInstance: false,
      ignoreDuplicate: true,
    }).then(async (db) => {
      await db.addCollections({
        devices: { schema: deviceSchema },
        rooms: { schema: roomSchema },
        scenes: { schema: sceneSchema },
        automations: { schema: automationSchema },
        history: { schema: historySchema },
        settings: { schema: settingsSchema },
      });
      return db;
    });
  }
  return dbPromise;
}

export const initDatabase = async () => {
  await getDb();
  return true;
};

export const getAllItems = async (collectionName) => {
  const db = await getDb();
  return db[collectionName].find().exec();
};

export const getItem = async (collectionName, id) => {
  const db = await getDb();
  return db[collectionName].findOne(id).exec();
};

export const save = async (collectionName, id, item) => {
  const db = await getDb();
  if (!item.id && collectionName !== "settings") {
    item.id = generateId();
  }
  if (collectionName === "settings") {
    await db.settings.upsert(item);
    return item;
  }
  await db[collectionName].upsert(item);
  return item;
};

export const deleteItem = async (collectionName, id) => {
  const db = await getDb();
  const doc = await db[collectionName].findOne(id).exec();
  if (doc) {
    await doc.remove();
    return true;
  }
  return false;
};

export const toggleDevice = async (deviceId) => {
  const db = await getDb();
  const doc = await db.devices.findOne(deviceId).exec();
  if (!doc) return null;
  const device = doc.toJSON();
  const newStatus = device.status === "on" ? "off" : "on";
  const updatedDevice = { ...device, status: newStatus };
  await db.devices.upsert(updatedDevice);
  return updatedDevice;
};
