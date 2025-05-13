import { jsonDB } from "../database-adapter";

export const getAllScenes = async () => {
  await jsonDB.init();
  return await jsonDB.getAllItems("scenes");
};

export const saveScene = async (sceneData) => {
  await jsonDB.init();
  return await jsonDB.save("scenes", sceneData.id, sceneData);
};

export const deleteScene = async (sceneId) => {
  await jsonDB.init();
  return await jsonDB.remove("scenes", sceneId);
};
