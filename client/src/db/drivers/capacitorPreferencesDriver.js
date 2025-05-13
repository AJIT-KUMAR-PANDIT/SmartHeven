// src/db/drivers/capacitorPreferencesDriver.js

let Preferences;
let isCapacitor = false;

// Only try to import Capacitor if we're in a native context
if (typeof window !== "undefined" && window?.cordova) {
  try {
    ({ Preferences } = require("@capacitor/preferences"));
    isCapacitor = true;
  } catch (e) {
    console.warn("Capacitor not available, falling back to browser mode");
  }
}

/**
 * Creates a Capacitor Preferences-based storage driver
 * @param {Object} options
 * @param {string} [options.base=''] - Optional base namespace for keys
 * @returns {Object} unstorage driver interface
 */
export function capacitorPreferencesDriver(options = {}) {
  const { base = "" } = options;

  // If not running in Capacitor, return a dummy/fallback driver
  if (!isCapacitor) {
    console.warn(
      "Capacitor Preferences driver skipped: Not in a Capacitor app"
    );
    return createFallbackDriver(options);
  }

  return {
    name: "capacitor-preferences",
    options,

    /**
     * Get all items as an object map
     */
    async getItems() {
      const { keys } = await Preferences.keys();
      const result = {};

      for (const key of keys) {
        if (!key.startsWith(base)) continue;
        const actualKey = key.slice(base.length);
        const { value } = await Preferences.get({ key });
        try {
          result[actualKey] = value ? JSON.parse(value) : null;
        } catch (e) {
          result[actualKey] = value; // fallback if not JSON
        }
      }

      return result;
    },

    /**
     * Get a single item by key
     */
    async getItem(key) {
      const k = `${base}${key}`;
      const { value } = await Preferences.get({ key: k });
      try {
        return value ? JSON.parse(value) : null;
      } catch (e) {
        return value;
      }
    },

    /**
     * Set an item by key
     */
    async setItem(key, value) {
      const k = `${base}${key}`;
      await Preferences.set({
        key: k,
        value: JSON.stringify(value),
      });
    },

    /**
     * Remove an item by key
     */
    async removeItem(key) {
      const k = `${base}${key}`;
      await Preferences.remove({ key: k });
    },

    /**
     * Clear all items under this namespace
     */
    async clear() {
      const { keys } = await Preferences.keys();
      for (const key of keys) {
        if (key.startsWith(base)) {
          await Preferences.remove({ key });
        }
      }
    },
  };
}

// Fallback driver for browser-only environments
function createFallbackDriver(options) {
  const store = {};
  const { base = "" } = options;

  return {
    name: "capacitor-preferences (fallback)",
    options,
    getItems: async () => ({ ...store }),
    getItem: async (key) => store[`${base}${key}`],
    setItem: async (key, value) => {
      store[`${base}${key}`] = value;
    },
    removeItem: async (key) => {
      delete store[`${base}${key}`];
    },
    clear: async () => {
      for (const key in store) {
        if (key.startsWith(base)) delete store[key];
      }
    },
  };
}
