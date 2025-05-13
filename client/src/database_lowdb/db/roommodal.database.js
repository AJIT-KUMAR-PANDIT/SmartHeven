import { jsonDB } from "../database-adapter";

export const getAllRooms = async () => {
  await jsonDB.init();
  return await jsonDB.getAllItems("rooms");
};

export const saveRoom = async (roomData) => {
  await jsonDB.init();
  return await jsonDB.save("rooms", roomData.id, roomData);
};

export const deleteRoom = async (roomId) => {
  await jsonDB.init();
  return await jsonDB.remove("rooms", roomId);
};
