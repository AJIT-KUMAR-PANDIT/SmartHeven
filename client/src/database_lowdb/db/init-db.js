import { Low } from "lowdb";
import adapter from "../database-adapter.js";

const initDatabase = async (defaultData) => {
  // ✅ MUST PASS defaultData HERE
  const db = new Low(adapter, defaultData);

  await db.read();
  return db;
};

// Default DB schemas
const defaultDevices = { devices: {} };
const defaultRooms = { rooms: {} };
const defaultScenes = { scenes: {} };

// Export initialized DBs
export const deviceDB = await initDatabase(defaultDevices);
export const roomDB = await initDatabase(defaultRooms);
export const sceneDB = await initDatabase(defaultScenes);
