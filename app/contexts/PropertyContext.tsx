"use client";

import React, {
  ReactNode,
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { useToastContext } from "@/contexts/ToastContext";
import { deleteEvent, approveEvent, rejectEvent } from "@/lib/redis";
import { PropertyProp } from "@/lib/types";

type PropertyContext = {
  open: boolean;
  editProperty: PropertyProp | null;
  currentProperty: PropertyProp | null;
  properties: PropertyProp[];
  setOpen: Dispatch<SetStateAction<boolean>>;
  setEditProperty: Dispatch<SetStateAction<PropertyProp | null>>;
  setCurrentProperty: Dispatch<SetStateAction<PropertyProp | null>>;
  setProperties: Dispatch<SetStateAction<PropertyProp[]>>;
  handleClick: () => void;
  handleClose: () => void;
  handleDeleteProperty: () => void;
  handlePropertySelectClick: (property) => void;
};

type PropertyContextProviderProps = {
  children: ReactNode;
};

export const PropertyContext = createContext<PropertyContext | null>(null);

export default function PropertyContextProvider({
  children,
}: PropertyContextProviderProps) {
  const { createToast } = useToastContext();

  const [open, setOpen] = useState(false);
  const [editProperty, setEditProperty] = useState<PropertyProp | null>(null);
  const [currentProperty, setCurrentProperty] = useState<PropertyProp | null>(
    null
  );
  const [properties, setProperties] = useState<PropertyProp[]>([]);

  const handleClick = () => {
    setOpen(true);
    setEditProperty(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteProperty = () => {
    setOpen(false);
  };

  const handlePropertySelectClick = (propertyId) => {
    properties.map((property) => {
      if (property.id == propertyId) {
        setCurrentProperty(property);
      }
    });
  };

  return (
    <PropertyContext.Provider
      value={{
        open,
        editProperty,
        currentProperty,
        properties,
        setOpen,
        setEditProperty,
        setCurrentProperty,
        setProperties,
        handleClick,
        handleClose,
        handleDeleteProperty,
        handlePropertySelectClick,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
}

export function usePropertyContext() {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error(
      "usePropertyContext must be called within a PropertyContextProvider"
    );
  }
  return context;
}
