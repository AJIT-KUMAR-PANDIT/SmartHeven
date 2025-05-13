import { jsonDB } from "../database-adapter";

export const getAllDevices = async () => {
  await jsonDB.init();
  return await jsonDB.getAllItems("devices");
};

export const saveDevice = async (deviceData) => {
  await jsonDB.init();
  return await jsonDB.save("devices", deviceData.id, deviceData);
};

export const deleteDevice = async (deviceId) => {
  await jsonDB.init();
  return await jsonDB.remove("devices", deviceId);
};
