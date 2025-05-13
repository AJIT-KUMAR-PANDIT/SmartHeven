import { Filesystem, Directory } from "@capacitor/filesystem";
import { LocalStorage } from "lowdb/browser";
import { Capacitor } from "@capacitor/core";

const isMobile = () => {
  try {
    return Capacitor.isNativePlatform(); // returns true on Android/iOS
  } catch {
    return false;
  }
};

export class UnifiedDBAdapter {
  constructor(filename = "nakprc-smarthaven") {
    this.filename = filename;
    this.adapter = isMobile()
      ? {
          read: async () => {
            try {
              const contents = await Filesystem.readFile({
                path: this.filename,
                directory: Directory.Data,
              });
              return JSON.parse(contents.data);
            } catch {
              return null;
            }
          },
          write: async (data) => {
            await Filesystem.writeFile({
              path: this.filename,
              data: JSON.stringify(data),
              directory: Directory.Data,
            });
          },
        }
      : new LocalStorage(this.filename);
  }

  getAdapter() {
    return this.adapter;
  }
}

export default new UnifiedDBAdapter().getAdapter();
