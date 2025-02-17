"use client";
import dynamic from "next/dynamic";
import { useRef, useEffect } from "react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import CalendarPopupModal from "@/components/Calendar/CalendarPopupModal";
import { fetchAllEvents } from "@/lib/redis";
import { usePropertyContext } from "@/contexts/PropertyContext";
import { useCalendarContext } from "@/contexts/CalendarContext";
import CalendarPopover from "@/components/Calendar/CalendarPopover";

// Import FullCalendar dynamically to disable SSR
const FullCalendar = dynamic(() => import("@fullcalendar/react"), {
  ssr: false,
});

export default function DefaultCalendar() {
  const { currentProperty } = usePropertyContext();
  const {
    events,
    setEvents,
    handleDateClick,
    handleEventClick,
    handleDateSelection,
  } = useCalendarContext();

  useEffect(() => {
    const init = async () => {
      if (currentProperty) {
        const allEvents = await fetchAllEvents(currentProperty.id);

        if (allEvents.error) {
          return;
        }

        if (allEvents.message) {
          setEvents(allEvents.message.data);
        }
      }
    };
    init();
  }, [currentProperty]);

  const renderEventContent = (event) => {
    return (
      <div className={`${eventStatusClass(event.event.extendedProps.status)}`}>
        {/* <b>{event.timeText}</b> */}
        <b>{event.event.title}</b>
      </div>
    );
  };

  function eventStatusClass(status) {
    switch (status) {
      // case 0:
      // case "0":
      //   return "bg-waiting text-dark";
      case 1:
      case "1":
        return "bg-approved text-dark";
      case 2:
      case "2":
        return "bg-rejected text-light";
    }
  }

  return (
    <>
      <FullCalendar
        key={events.length}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        validRange={{
          start: new Date(), // Disables past dates
        }}
        nextDayThreshold="10:00:00"
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        selectable={true}
        select={handleDateSelection}
        eventContent={renderEventContent}
      />
      <CalendarPopupModal />
      <CalendarPopover />
    </>
  );
}
