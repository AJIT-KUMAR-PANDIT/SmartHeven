
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';

const DB_NAME = 'smarthome.db';
const sqlite = new SQLiteConnection(CapacitorSQLite);
let _db = null;

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

export async function initDatabase() {
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
}

export async function getAllItems(tableName) {
  try {
    const db = await getDb();
    const result = await db.query(`SELECT * FROM ${tableName}`);
    return result.values.map(item => {
      // Parse JSON fields
      ['settings', 'devices', 'actions', 'trigger'].forEach(field => {
        if (item[field]) {
          try {
            item[field] = JSON.parse(item[field]);
          } catch (e) {}
        }
      });
      // Convert boolean fields
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
}

export async function getItem(tableName, id) {
  try {
    const db = await getDb();
    const result = await db.query(
      `SELECT * FROM ${tableName} WHERE id = ?`,
      [id]
    );
    return result.values[0];
  } catch (err) {
    console.error(`Error fetching ${tableName} item:`, err);
    return null;
  }
}

export async function saveItem(tableName, item) {
  if (!requireAuth(['admin', 'user'])) {
    throw new Error('Permission denied');
  }
  
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
      INSERT INTO ${tableName} (${fields.join(', ')})
      VALUES (${placeholders})
      ON CONFLICT(id) DO UPDATE SET ${updateFields}
    `;
    
    await db.run(query, [...values, ...values]);
    return item;
  } catch (err) {
    console.error(`Error saving ${tableName} item:`, err);
    throw err;
  }
}

export async function deleteItem(tableName, id) {
  try {
    const db = await getDb();
    await db.run(`DELETE FROM ${tableName} WHERE id = ?`, [id]);
    return true;
  } catch (err) {
    console.error(`Error deleting ${tableName} item:`, err);
    return false;
  }
}
