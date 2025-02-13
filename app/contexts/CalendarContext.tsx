"use client";

import React, {
  ReactNode,
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { useDefaultContext } from "@/contexts/DefaultContext";
import { useToastContext } from "@/contexts/ToastContext";
import { deleteEvent, approveEvent, rejectEvent } from "@/lib/redis";
import { EventInfoProp, EventProp } from "@/lib/types";

type CalendarContext = {
  open: boolean;
  popupType: string;
  anchorEl: HTMLElement | null;
  events: EventProp[];
  eventInfo: EventInfoProp | null;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setPopupType: Dispatch<SetStateAction<string>>;
  setAnchorEl: Dispatch<SetStateAction<HTMLElement | null>>;
  setEvents: Dispatch<SetStateAction<EventProp[]>>;
  setEventInfo: Dispatch<SetStateAction<EventInfoProp | null>>;
  handleDateClick: (event: any) => void;
  handleEventClick: (event: any) => void;
  handleClose: () => void;
  handleEditEvent: () => void;
  handleDeleteEvent: () => void;
  handleApproveEvent: () => void;
  handleRejectEvent: () => void;
  handleDateSelection: (event: any) => void;
};

type CalendarContextProviderProps = {
  children: ReactNode;
};

export const CalendarContext = createContext<CalendarContext | null>(null);

export default function CalendarContextProvider({
  children,
}: CalendarContextProviderProps) {
  const { isDarkMode } = useDefaultContext();
  const { createToast } = useToastContext();

  const [open, setOpen] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [events, setEvents] = useState<EventProp[]>([]);
  const [eventInfo, setEventInfo] = useState<EventInfoProp | null>(null);

  const handleDateClick = (arg) => {
    setOpen(true);
    setEventInfo({
      id: "",
      title: "",
      start: arg.dateStr,
    });
  };

  const handleEventClick = (event) => {
    event.jsEvent.preventDefault(); // don't let the browser navigate

    setEventInfo({
      id: event.event.id,
      title: event.event.title,
      start: event.event.start?.toLocaleDateString() || "",
    });
    setAnchorEl(event.el); // Attach popover to the clicked event
  };

  const handleClose = () => {
    // setEventInfo(null);
    setAnchorEl(null);
  };

  const handleEditEvent = () => {
    setOpen(true);
    setAnchorEl(null);
  };

  const handleDeleteEvent = async () => {
    if (eventInfo) {
      const result = await deleteEvent(eventInfo.id);
      if (result.message) {
        createToast(result.message.data.text, "success");
        setEvents((prevEvents) => {
          const updatedEvents = prevEvents.filter(
            (event) => event.id != result.message.data.eventId
          );
          return updatedEvents;
        });
        setAnchorEl(null);
      }
    }
  };

  const handleApproveEvent = async () => {
    if (eventInfo) {
      const currentEvent = events.find((event) => event.id == eventInfo.id);
      if (currentEvent) {
        const result = await approveEvent(currentEvent);

        if (result.message) {
          createToast(result.message.data.text, "success");
          setEvents((prevEvents) =>
            prevEvents.map((event) =>
              event.id == result.message.data.id ? result.message.data : event
            )
          );
        }
        setAnchorEl(null);
      }
    }
  };

  const handleRejectEvent = async () => {
    if (eventInfo) {
      const currentEvent = events.find((event) => event.id == eventInfo.id);
      if (currentEvent) {
        const result = await rejectEvent(currentEvent);

        if (result.message) {
          createToast(result.message.data.text, "success");
          setEvents((prevEvents) =>
            prevEvents.map((event) =>
              event.id == result.message.data.id ? result.message.data : event
            )
          );
        }
        setAnchorEl(null);
      }
    }
  };

  const handleDateSelection = (arg) => {
    setOpen(true);
    setEventInfo({
      id: "",
      title: "",
      start: arg.startStr,
      end: arg.endStr,
    });
  };

  return (
    <CalendarContext.Provider
      value={{
        open,
        popupType,
        anchorEl,
        events,
        eventInfo,
        setOpen,
        setPopupType,
        setAnchorEl,
        setEvents,
        setEventInfo,
        handleDateClick,
        handleEventClick,
        handleClose,
        handleEditEvent,
        handleDeleteEvent,
        handleApproveEvent,
        handleRejectEvent,
        handleDateSelection,
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
