import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Execute a query with error handling
async function query(text, params) {
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (err) {
    console.error('Database query error:', err);
    throw err;
  }
}

// Initialize database tables
async function initDatabase() {
  try {
    // Create devices table
    await query(`
      CREATE TABLE IF NOT EXISTS devices (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        room TEXT NOT NULL,
        status TEXT NOT NULL,
        value REAL,
        battery REAL,
        lastUpdated BIGINT,
        connected BOOLEAN,
        firmware TEXT,
        settings JSONB
      )
    `);

    // Create rooms table
    await query(`
      CREATE TABLE IF NOT EXISTS rooms (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        floor INTEGER,
        icon TEXT,
        devices JSONB
      )
    `);

    // Create scenes table
    await query(`
      CREATE TABLE IF NOT EXISTS scenes (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT,
        actions JSONB,
        isActive BOOLEAN,
        lastTriggered BIGINT
      )
    `);

    // Create automations table
    await query(`
      CREATE TABLE IF NOT EXISTS automations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        trigger JSONB,
        actions JSONB,
        isEnabled BOOLEAN,
        lastTriggered BIGINT
      )
    `);

    // Create history table
    await query(`
      CREATE TABLE IF NOT EXISTS history (
        id TEXT PRIMARY KEY,
        deviceId TEXT NOT NULL,
        event TEXT NOT NULL,
        value TEXT,
        timestamp BIGINT NOT NULL,
        user TEXT
      )
    `);

    // Create settings table
    await query(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value JSONB,
        updatedAt BIGINT
      )
    `);

    console.log('Database tables initialized');
    return true;
  } catch (err) {
    console.error('Database initialization error:', err);
    return false;
  }
}

// Get all items from a table
async function getAllItems(tableName) {
  try {
    const result = await query(`SELECT * FROM ${tableName}`);
    return result.rows;
  } catch (err) {
    console.error(`Error getting all items from ${tableName}:`, err);
    return [];
  }
}

// Get a single item by ID
async function getItem(tableName, id) {
  try {
    const result = await query(`SELECT * FROM ${tableName} WHERE id = $1`, [id]);
    return result.rows[0];
  } catch (err) {
    console.error(`Error getting item from ${tableName}:`, err);
    return null;
  }
}

// Save or update an item
async function saveItem(tableName, item) {
  if (!item || !item.id) {
    throw new Error('Invalid item data - ID is required');
  }

  try {
    // Get column names from the table
    const tableInfoResult = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = $1
    `, [tableName]);
    
    const columns = tableInfoResult.rows.map(row => row.column_name);
    
    // Filter item properties that match column names
    const validKeys = Object.keys(item).filter(key => columns.includes(key));
    
    if (validKeys.length === 0) {
      throw new Error(`No valid columns found for table ${tableName}`);
    }
    
    // Build parameterized query
    const placeholders = validKeys.map((_, i) => `$${i + 1}`).join(', ');
    const columnNames = validKeys.join(', ');
    const updateClauses = validKeys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    const values = validKeys.map(key => {
      // Convert objects to JSON strings for JSONB columns
      if (typeof item[key] === 'object' && item[key] !== null) {
        return JSON.stringify(item[key]);
      }
      return item[key];
    });
    
    // Use upsert (insert or update)
    const query = `
      INSERT INTO ${tableName} (${columnNames})
      VALUES (${placeholders})
      ON CONFLICT (id) 
      DO UPDATE SET ${updateClauses}
      RETURNING *
    `;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error(`Error saving item to ${tableName}:`, err);
    throw err;
  }
}

// Delete an item
async function deleteItem(tableName, id) {
  try {
    await query(`DELETE FROM ${tableName} WHERE id = $1`, [id]);
    return true;
  } catch (err) {
    console.error(`Error deleting item from ${tableName}:`, err);
    return false;
  }
}

// Export database to JSON file
async function exportDatabase(filePath) {
  try {
    const data = {};
    
    // Get data from all tables
    const tables = ['devices', 'rooms', 'scenes', 'automations', 'history', 'settings'];
    
    for (const table of tables) {
      data[table] = await getAllItems(table);
    }
    
    // Write to file
    const exportPath = filePath || path.join(process.cwd(), 'db_export.json');
    fs.writeFileSync(exportPath, JSON.stringify(data, null, 2));
    
    return { success: true, path: exportPath };
  } catch (err) {
    console.error('Error exporting database:', err);
    return { success: false, error: err.message };
  }
}

// Import database from JSON file
async function importDatabase(filePath, options = { clearExisting: false }) {
  try {
    if (!fs.existsSync(filePath)) {
      return { success: false, error: 'File not found' };
    }
    
    const fileData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileData);
    
    // Clear existing data if requested
    if (options.clearExisting) {
      const tables = ['devices', 'rooms', 'scenes', 'automations', 'history', 'settings'];
      for (const table of tables) {
        await query(`DELETE FROM ${table}`);
      }
    }
    
    // Import data for each table
    for (const [table, items] of Object.entries(data)) {
      if (Array.isArray(items)) {
        for (const item of items) {
          await saveItem(table, item);
        }
      }
    }
    
    return { success: true };
  } catch (err) {
    console.error('Error importing database:', err);
    return { success: false, error: err.message };
  }
}

export {
  query,
  initDatabase,
  getAllItems,
  getItem,
  saveItem,
  deleteItem,
  exportDatabase,
  importDatabase
};