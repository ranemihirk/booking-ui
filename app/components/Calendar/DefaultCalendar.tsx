"use client";
import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import CalendarPopupModal from "@/components/Calendar/CalendarPopupModal";
import { fetchAllEvents } from "@/lib/redis";
import { EventProp } from "@/lib/types";

type EventInfoProp = {
  id: string;
  title: string;
  start: string;
};

const defaultEvent = {
  id: "1",
  title: "event 1",
  date: "2025-02-15",
};
export default function DefaultCalendar() {
  const [open, setOpen] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [events, setEvents] = useState<EventProp[]>([]);
  const [eventInfo, setEventInfo] = useState<EventInfoProp | null>(null);

  const calendarRef = useRef(null);

  const handleDateClick = (arg) => {
    console.log("handleDateClick: ", arg);
    setOpen(true);
    setEventInfo({
      id: "",
      title: "",
      start: arg.dateStr,
    });
  };

  const handleEventClick = (event) => {
    console.log("handleEventClick: ", event);

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
    console.log("events: ", events);
  }, [events]);

  return (
    <>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        validRange={{
          start: new Date(), // Disables past dates
        }}
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
      />
      <CalendarPopupModal
        open={open}
        setOpen={setOpen}
        eventInfo={eventInfo}
        events={events}
        setEvents={setEvents}
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
            <Button className="capitalize text-light border-light">
              Approve
            </Button>
            <Button
              className="capitalize text-light border-light"
              onClick={handleEditEvent}
            >
              Edit
            </Button>
            <Button className="capitalize text-light border-light">
              Delete
            </Button>
          </ButtonGroup>
        </Box>
      </Popover>
    </>
  );
}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}
