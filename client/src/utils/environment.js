export const isProduction = () => {
  return process.env.NODE_ENV === "production";
};

export const isDevelopment = () => {
  return !isProduction();
};

export const disableRxDBDevMode = () => {
  if (isProduction()) {
    window.disableRxDBDevMode?.();
  }
};
