// src/db/storageWrapper.js

let storageInstance = null;

// Initialize storage async
import("../db/unstorage.js").then(({ storage }) => {
  storageInstance = storage;
});

// Use this getter in components
export function getStorage() {
  if (!storageInstance) {
    throw new Error("Storage not initialized yet");
  }
  return storageInstance;
}
