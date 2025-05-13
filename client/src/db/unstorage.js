import { createStorage } from "unstorage";
import indexedDbDriver from "unstorage/drivers/indexeddb";
import capacitorPreferencesDriver from "unstorage/drivers/capacitor-preferences";

// Detect if we're running in Capacitor
const isCapacitor = typeof window !== "undefined" && window?.cordova;

// Create appropriate driver
let driver;
if (isCapacitor) {
  // Use Capacitor Preferences API
  driver = capacitorPreferencesDriver({
    base: "myapp:",
  });
} else {
  // Use IndexedDB for web
  driver = indexedDbDriver({
    base: "myapp:",
    dbName: "myapp-db",
    storeName: "keyval-store",
  });
}

// Create universal storage instance
export const storage = createStorage({ driver });
