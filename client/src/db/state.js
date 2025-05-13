import { signal } from "@preact/signals";
import { storage } from "./unstorage";

// Signals
export const devicesSignal = signal([]);
export const roomsSignal = signal([]);
export const scenesSignal = signal([]);
export const automationsSignal = signal([]);
export const historySignal = signal([]);
export const settingsSignal = signal({});

// Load initial data into signals
export async function initDatabase() {
  const loadDocs = async (key) => {
    try {
      const data = await storage.getItem(key);
      return data || [];
    } catch (err) {
      console.error(`Error loading ${key}:`, err);
      return [];
    }
  };

  devicesSignal.value = await loadDocs("devices");
  roomsSignal.value = await loadDocs("rooms");
  scenesSignal.value = await loadDocs("scenes");
  automationsSignal.value = await loadDocs("automations");
  historySignal.value = await loadDocs("history");

  const settingsList = await loadDocs("settings");
  const settingsMap = {};
  settingsList.forEach((s) => {
    if (s.key) settingsMap[s.key] = s;
  });
  settingsSignal.value = settingsMap;
}
