import { Low } from "lowdb";
import adapter from "../database-adapter.js";
import AuthDB from "./auth.db.js";

const initDatabase = async (defaultData) => {
  const db = new Low(adapter, defaultData);
  await db.read();
  return db;
};

// Default DB schemas
const defaultDevices = { devices: {} };
const defaultRooms = { rooms: {} };
const defaultScenes = { scenes: {} };
const defaultAuth = { users: {} };

// Export initialized DBs
export const deviceDB = await initDatabase(defaultDevices);
export const roomDB = await initDatabase(defaultRooms);
export const sceneDB = await initDatabase(defaultScenes);
export const authDB = new AuthDB();
