// src/db/unstorage.js

// Detect if we're running in Capacitor
const isCapacitor = typeof window !== "undefined" && !!window?.cordova;

let driverModule;

if (isCapacitor) {
  // Load Capacitor driver dynamically
  driverModule = import("./drivers/capacitorPreferencesDriver.js");
} else {
  // Load IndexedDB driver dynamically
  driverModule = import("./drivers/indexedDbDriver.js");
}

// Import unstorage
import { createStorage } from "unstorage";

// Create storage instance after resolving driver
driverModule
  .then((module) => {
    const driver = isCapacitor
      ? module.capacitorPreferencesDriver({
          base: "nakprc-smarthaven:",
        })
      : module.indexedDbDriver({
          base: "nakprc-smarthaven:",
          dbName: "nakprc-smarthaven-db",
          storeName: "nakprc-smarthaven-store",
        });

    const storage = createStorage({ driver });
    // Export it globally or attach to window for testing
    window.storage = storage;
  })
  .catch((err) => {
    console.error("Failed to load storage driver", err);
  });

// Export as placeholder until resolved
export const storage = null;
