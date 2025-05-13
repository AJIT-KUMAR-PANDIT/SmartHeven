// src/db/store.jsx

import { createContext, useContext, useState } from "react";

const AppStoreContext = createContext();

export function AppStoreProvider({ children }) {
  const [devices, setDevices] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [scenes, setScenes] = useState([]);
  const [automations, setAutomations] = useState([]);
  const [history, setHistory] = useState([]);
  const [settings, setSettings] = useState({});
  const [activeRoom, setActiveRoom] = useState(null);

  const value = {
    devices,
    setDevices,
    rooms,
    setRooms,
    scenes,
    setScenes,
    automations,
    setAutomations,
    history,
    setHistory,
    settings,
    setSettings,
    activeRoom,
    setActiveRoom,
  };

  return (
    <AppStoreContext.Provider value={value}>
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppStoreContext);
  if (!context)
    throw new Error("useAppStore must be used within AppStoreProvider");
  return context;
}
