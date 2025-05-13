import {
  devicesSignal,
  roomsSignal,
  scenesSignal,
  automationsSignal,
  historySignal,
  settingsSignal,
} from "./state";

export async function refreshSignals(collectionName) {
  const docs = await (async () => {
    switch (collectionName) {
      case "devices":
        return (devicesSignal.value = await getUpdatedData(collectionName));
      case "rooms":
        return (roomsSignal.value = await getUpdatedData(collectionName));
      case "scenes":
        return (scenesSignal.value = await getUpdatedData(collectionName));
      case "automations":
        return (automationsSignal.value = await getUpdatedData(collectionName));
      case "history":
        return (historySignal.value = await getUpdatedData(collectionName));
      case "settings":
        const settingsList = await getUpdatedData(collectionName);
        const settingsMap = {};
        settingsList.forEach((s) => {
          if (s.key) settingsMap[s.key] = s;
        });
        settingsSignal.value = settingsMap;
        break;
      default:
        break;
    }
  })();
}

async function getUpdatedData(collectionName) {
  const data = await import("./state").then(({ getAllItems }) =>
    getAllItems(collectionName)
  );
  return data || [];
}
