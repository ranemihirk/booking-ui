"use client";

import React, {
  ReactNode,
  createContext,
  useContext,
} from "react";
import { Id, toast, ToastOptions } from "react-toastify";

type CalendarContext = {
  createToast: (content, type) => Id;
  updateToast: (content, type, toastId) => void;
};

type CalendarContextProviderProps = {
  children: ReactNode;
};

export const CalendarContext = createContext<CalendarContext | null>(null);

export default function CalendarContextProvider({
  children,
}: CalendarContextProviderProps) {
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
    <CalendarContext.Provider
      value={{
        createToast,
        updateToast,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendarContext() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error(
      "useCalendarContext must be called within a CalendarContextProvider"
    );
  }
  return context;
}
