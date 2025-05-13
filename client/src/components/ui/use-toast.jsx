import * as Toast from "@radix-ui/react-toast";
import { Toaster } from "./toaster";

export const useToast = () => {
  // Define and return the toast functionality here
};

export const ToastProvider = () => (
  <Toast.Provider>
    <Toaster />
    <Toast.Viewport className="[--viewport-padding:_25px] fixed bottom-0 right-0 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[390px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none" />
  </Toast.Provider>
);
