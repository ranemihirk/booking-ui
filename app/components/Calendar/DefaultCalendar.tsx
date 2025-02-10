"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { faX } from "@fortawesome/free-solid-svg-icons/faX";
import CalendarPopupModal from "@/components/Calendar/CalendarPopupModal";
import {
  fetchAllEvents,
  deleteEvent,
  approveEvent,
  rejectEvent,
  deleteAllEvents,
} from "@/lib/redis";
import { EventInfoProp, EventProp } from "@/lib/types";
import { useToastContext } from "@/contexts/ToastContext";

const defaultEvent = {
  id: "1",
  title: "event 1",
  date: "2025-02-15",
};
export default function DefaultCalendar() {
  const { createToast } = useToastContext();

  const [open, setOpen] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [events, setEvents] = useState<EventProp[]>([]);
  const [eventInfo, setEventInfo] = useState<EventInfoProp | null>(null);

  const calendarRef = useRef(null);

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

  const handleDeleteAllEvents = async () => {
    const result = await deleteAllEvents();
    if (result.message) {
      createToast(result.message.data, "success");
      setEvents([]);
    }
  };

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

  useEffect(() => {
    console.log("events: ", events, events.length);
  }, [events]);

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
      <Button
        className="capitalize text-light border-light"
        variant="contained"
        onClick={handleDeleteAllEvents}
      >
        Delete All Events
      </Button>
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
      <CalendarPopupModal
        open={open}
        setOpen={setOpen}
        eventInfo={eventInfo}
        events={events}
        setEvents={setEvents}
        setEventInfo={setEventInfo}
      />
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        className=""
      >
        <Box p={1} sx={{ bgcolor: "black" }}>
          <ButtonGroup
            orientation="vertical"
            aria-label="Vertical button group"
            className="w-full bg-dark "
          >
            <Button
              className="capitalize text-light border-light hover:bg-green/60"
              onClick={handleApproveEvent}
            >
              <FontAwesomeIcon icon={faCheck} className="mr-1" />
              Approve
            </Button>
            <Button
              className="capitalize text-light border-light hover:bg-red/60"
              onClick={handleRejectEvent}
            >
              <FontAwesomeIcon icon={faX} className="mr-1" />
              Reject
            </Button>
            <Button
              className="capitalize text-light border-light"
              onClick={handleEditEvent}
            >
              Edit
            </Button>
            <Button
              className="capitalize text-light border-light"
              onClick={handleDeleteEvent}
            >
              Delete
            </Button>
          </ButtonGroup>
        </Box>
      </Popover>
    </>
  );
}
