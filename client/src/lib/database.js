
import { Pool } from 'pg';
import { openDB, deleteDB, wrap, unwrap } from 'idb';

// Initialize IndexedDB for offline storage
const initIndexedDB = async () => {
  const db = await openDB('smartHomeDB', 1, {
    upgrade(db) {
      ['devices', 'rooms', 'scenes', 'automations', 'settings'].forEach(store => {
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store, { keyPath: 'id' });
        }
      });
    },
  });
  return db;
};

// Database operations with offline support
export async function initDatabase() {
  try {
    const db = await initIndexedDB();
    const response = await fetch('/api/init', { method: 'POST' });
    if (!response.ok) throw new Error('Failed to initialize database');
    return true;
  } catch (err) {
    console.error('Database initialization error:', err);
    return false;
  }
}

export async function getAllItems(tableName) {
  try {
    const response = await fetch(`/api/${tableName}`);
    if (!response.ok) throw new Error(`Failed to fetch ${tableName}`);
    const data = await response.json();
    
    // Store in IndexedDB for offline access
    const db = await initIndexedDB();
    const tx = db.transaction(tableName, 'readwrite');
    const store = tx.objectStore(tableName);
    await Promise.all(data.map(item => store.put(item)));
    
    return data;
  } catch (err) {
    console.error(`Error fetching ${tableName}:`, err);
    // Fallback to IndexedDB if offline
    const db = await initIndexedDB();
    return db.getAll(tableName);
  }
}

export async function getItem(tableName, id) {
  try {
    const response = await fetch(`/api/${tableName}/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch ${tableName} item`);
    return await response.json();
  } catch (err) {
    console.error(`Error fetching ${tableName} item:`, err);
    const db = await initIndexedDB();
    return db.get(tableName, id);
  }
}

export async function saveItem(tableName, item) {
  try {
    const response = await fetch(`/api/${tableName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    if (!response.ok) throw new Error(`Failed to save ${tableName} item`);
    const savedItem = await response.json();
    
    // Update IndexedDB
    const db = await initIndexedDB();
    await db.put(tableName, savedItem);
    
    return savedItem;
  } catch (err) {
    console.error(`Error saving ${tableName} item:`, err);
    throw err;
  }
}

export async function deleteItem(tableName, id) {
  try {
    const response = await fetch(`/api/${tableName}/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error(`Failed to delete ${tableName} item`);
    
    // Remove from IndexedDB
    const db = await initIndexedDB();
    await db.delete(tableName, id);
    
    return true;
  } catch (err) {
    console.error(`Error deleting ${tableName} item:`, err);
    return false;
  }
}
