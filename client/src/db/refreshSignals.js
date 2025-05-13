import { useAppStore } from "./store";
import { getAllItems } from "./database";

export async function refreshSignals(collectionName) {
  const {
    setDevices,
    setRooms,
    setScenes,
    setAutomations,
    setHistory,
    setSettings,
  } = useAppStore();

  const getUpdatedData = async (collection) => {
    try {
      return await getAllItems(collection);
    } catch (err) {
      console.error(`Error fetching collection: ${collection}`, err);
      return [];
    }
  };

  switch (collectionName) {
    case "devices":
      setDevices(await getUpdatedData("devices"));
      break;
    case "rooms":
      setRooms(await getUpdatedData("rooms"));
      break;
    case "scenes":
      setScenes(await getUpdatedData("scenes"));
      break;
    case "automations":
      setAutomations(await getUpdatedData("automations"));
      break;
    case "history":
      setHistory(await getUpdatedData("history"));
      break;
    case "settings": {
      const settingsList = await getUpdatedData("settings");
      const settingsMap = {};
      settingsList.forEach((s) => {
        if (s.key) settingsMap[s.key] = s;
      });
      setSettings(settingsMap);
      break;
    }
    default:
      console.warn(`Unknown collection: ${collectionName}`);
  }
}
