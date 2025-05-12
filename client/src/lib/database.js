
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { v4 as uuidv4 } from 'uuid';

const DB_NAME = 'smarthome.db';
const sqlite = new SQLiteConnection(CapacitorSQLite);
let _db = null;

export const generateId = () => uuidv4();

const initWebStore = async () => {
  const platform = Capacitor.getPlatform();
  if (platform === 'web') {
    await sqlite.initWebStore();
  }
};

const getDb = async () => {
  if (!_db) {
    await initWebStore();
    const ret = await sqlite.createConnection(
      DB_NAME,
      false,
      'no-encryption',
      1,
      false
    );
    _db = ret;
  }
  return _db;
};

export const init = async () => {
  try {
    const db = await getDb();
    await db.open();

    const queries = [
      `CREATE TABLE IF NOT EXISTS devices (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        room TEXT NOT NULL,
        status TEXT NOT NULL,
        value REAL,
        battery REAL,
        lastUpdated INTEGER,
        connected INTEGER,
        firmware TEXT,
        settings TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS rooms (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        floor INTEGER,
        icon TEXT,
        devices TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS scenes (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT,
        actions TEXT,
        isActive INTEGER,
        lastTriggered INTEGER
      )`,
      `CREATE TABLE IF NOT EXISTS automations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        trigger TEXT,
        actions TEXT,
        isEnabled INTEGER,
        lastTriggered INTEGER
      )`
    ];

    for (const query of queries) {
      await db.execute(query);
    }
    return true;
  } catch (err) {
    console.error('Database initialization error:', err);
    return false;
  }
};

export const getAllItems = async (tableName) => {
  try {
    const db = await getDb();
    const result = await db.query(`SELECT * FROM ${tableName}`);
    return result.values.map(item => {
      ['settings', 'devices', 'actions', 'trigger'].forEach(field => {
        if (item[field]) {
          try {
            item[field] = JSON.parse(item[field]);
          } catch (e) {}
        }
      });
      ['connected', 'isActive', 'isEnabled'].forEach(field => {
        if (item[field] !== undefined) {
          item[field] = Boolean(item[field]);
        }
      });
      return item;
    });
  } catch (err) {
    console.error(`Error fetching ${tableName}:`, err);
    return [];
  }
};

export const getItem = async (tableName, id) => {
  try {
    const db = await getDb();
    const result = await db.query(
      `SELECT * FROM ${tableName} WHERE id = ?`,
      [id]
    );
    const item = result.values[0];
    if (item) {
      ['settings', 'devices', 'actions', 'trigger'].forEach(field => {
        if (item[field]) {
          try {
            item[field] = JSON.parse(item[field]);
          } catch (e) {}
        }
      });
    }
    return item;
  } catch (err) {
    console.error(`Error fetching ${tableName} item:`, err);
    return null;
  }
};

export const saveItem = async (tableName, item) => {
  if (!item || !item.id) {
    throw new Error('Invalid item data - ID is required');
  }

  try {
    const db = await getDb();
    const fields = Object.keys(item);
    const values = fields.map(field => {
      const value = item[field];
      if (typeof value === 'object') {
        return JSON.stringify(value);
      }
      if (typeof value === 'boolean') {
        return value ? 1 : 0;
      }
      return value;
    });
    
    const placeholders = fields.map(() => '?').join(', ');
    const updateFields = fields.map(field => `${field} = ?`).join(', ');
    
    const query = `
      INSERT OR REPLACE INTO ${tableName} (${fields.join(', ')})
      VALUES (${placeholders})
    `;
    
    await db.run(query, values);
    return item;
  } catch (err) {
    console.error(`Error saving ${tableName} item:`, err);
    throw err;
  }
};

export const deleteItem = async (tableName, id) => {
  try {
    const db = await getDb();
    await db.run(`DELETE FROM ${tableName} WHERE id = ?`, [id]);
    return true;
  } catch (err) {
    console.error(`Error deleting ${tableName} item:`, err);
    return false;
  }
};

export const toggleDevice = async (deviceId) => {
  try {
    const device = await getItem('devices', deviceId);
    if (!device) return null;
    
    const newStatus = device.status === 'on' ? 'off' : 'on';
    const updatedDevice = { ...device, status: newStatus };
    await saveItem('devices', updatedDevice);
    return updatedDevice;
  } catch (err) {
    console.error('Error toggling device:', err);
    throw err;
  }
};
