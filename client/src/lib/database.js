// Database operations
export async function initDatabase() {
  try {
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
    return await response.json();
  } catch (err) {
    console.error(`Error fetching ${tableName}:`, err);
    return [];
  }
}

export async function getItem(tableName, id) {
  try {
    const response = await fetch(`/api/${tableName}/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch ${tableName} item`);
    return await response.json();
  } catch (err) {
    console.error(`Error fetching ${tableName} item:`, err);
    return null;
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
    return await response.json();
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
    return true;
  } catch (err) {
    console.error(`Error deleting ${tableName} item:`, err);
    return false;
  }
}