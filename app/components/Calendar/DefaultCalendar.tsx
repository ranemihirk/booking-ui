"use client";
import { useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import CalendarPopupModal from "@/components/Calendar/CalendarPopupModal";
import { fetchAllEvents } from "@/lib/redis";
import { useCalendarContext } from "@/contexts/CalendarContext";
import CalendarPopover from "@/components/Calendar/CalendarPopover";

export default function DefaultCalendar() {
  const {
    events,
    setEvents,
    handleDateClick,
    handleEventClick,
    handleDateSelection,
  } = useCalendarContext();

  const calendarRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      const allEvents = await fetchAllEvents();

      if (allEvents.error) {
        return;
      }

      if (allEvents.message) {
        setEvents(allEvents.message.data);
      }
    };
    init();
  }, []);

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
        ref={calendarRef}
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
