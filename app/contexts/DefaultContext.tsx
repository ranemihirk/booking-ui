// context/DefaultContext.js
"use client";

import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

type DefaultContextProviderProps = {
  children: ReactNode;
};

type DefaultContextProp = {
  isDarkMode: boolean;
  isLargeScreen: boolean;
  setIsDarkMode: Dispatch<SetStateAction<boolean>>;
  toggleDarkMode: () => void;
};

export const DefaultContext = createContext<DefaultContextProp | null>(null);

export default function DefaultContextProvider({
  children,
}: DefaultContextProviderProps) {
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      document.documentElement.classList.toggle("dark", newMode);
      return newMode;
    });
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches);
    document.documentElement.classList.toggle("dark", mediaQuery.matches);
  }, []);

  return (
    <DefaultContext.Provider
      value={{
        isDarkMode,
        isLargeScreen,
        setIsDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </DefaultContext.Provider>
  );
}

export function useDefaultContext() {
  const context = useContext(DefaultContext);
  if (!context) {
    throw new Error(
      "useDefaultContext must be called within a DefaultContextProvider"
    );
  }
  return context;
}
