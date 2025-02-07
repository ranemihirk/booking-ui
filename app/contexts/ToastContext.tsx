"use client";

import React, {
  ReactNode,
  createContext,
  useContext,
} from "react";
import { Id, toast, ToastOptions } from "react-toastify";

type ToastContext = {
  createToast: (content, type) => Id;
  updateToast: (content, type, toastId) => void;
};

type ToastContextProviderProps = {
  children: ReactNode;
};

export const ToastContext = createContext<ToastContext | null>(null);

export default function ToastContextProvider({
  children,
}: ToastContextProviderProps) {
  const defaultToastOptions: ToastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  const createToast = (content, type) => {
    return toast(content, {
      ...defaultToastOptions,
      type: type,
    });
  };

  const updateToast = (content, type, toastId) => {
    return toast.update(toastId, {
      ...defaultToastOptions,
      type: type,
      render: content,
    });
  };

  return (
    <ToastContext.Provider
      value={{
        createToast,
        updateToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error(
      "useToastContext must be called within a ToastContextProvider"
    );
  }
  return context;
}
