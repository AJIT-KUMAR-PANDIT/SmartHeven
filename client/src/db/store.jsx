// src/db/store.jsx

import React, { useState, createContext, useContext } from "react";

// Create context
const AppStoreContext = createContext();

export function AppStoreProvider({ children }) {
  const [devices, setDevices] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [scenes, setScenes] = useState([]);
  const [automations, setAutomations] = useState([]);
  const [history, setHistory] = useState([]);
  const [settings, setSettings] = useState({});

  const store = {
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
  };

  return (
    <AppStoreContext.Provider value={store}>
      {children}
    </AppStoreContext.Provider>
  );
}

// Custom Hook – only used inside React components!
export function useAppStore() {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error("useAppStore must be used inside AppStoreProvider");
  }
  return context;
}
