import { storage } from "./unstorage";
import { refreshSignals } from "./utils";

// Get all items from a collection
export async function getAllItems(collectionName) {
  return (await storage.getItem(collectionName)) || [];
}

// Get single item by ID
export async function getItem(collectionName, id) {
  const items = await getAllItems(collectionName);
  return items.find((i) => i._id === id) || null;
}

// Save or update an item
export async function save(collectionName, id, item) {
  item._id = id;

  const items = (await getAllItems(collectionName)) || [];
  const index = items.findIndex((i) => i._id === id);

  if (index > -1) {
    items[index] = item;
  } else {
    items.push(item);
  }

  await storage.setItem(collectionName, items);
  await refreshSignals(collectionName);
  return item;
}

// Delete an item
export async function deleteItem(collectionName, id) {
  const items = await getAllItems(collectionName);
  const updated = items.filter((i) => i._id !== id);
  await storage.setItem(collectionName, updated);
  await refreshSignals(collectionName);
  return true;
}

// Toggle device status
export async function toggleDevice(deviceId) {
  const device = await getItem("devices", deviceId);
  if (!device) return null;

  device.status = device.status === "on" ? "off" : "on";
  await save("devices", deviceId, device);
  return device;
}

// Reset database (delete all data)
export async function resetDatabase() {
  const collections = [
    "devices",
    "rooms",
    "scenes",
    "automations",
    "history",
    "settings",
  ];
  for (let collection of collections) {
    await storage.removeItem(collection);
  }

  window.location.reload();
}
