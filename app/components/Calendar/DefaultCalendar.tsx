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

export default function DefaultCalendar() {
  const [open, setOpen] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [eventInfo, setEventInfo] = useState<{
    id: string;
    title: string;
    date: string;
  } | null>(null);

  const calendarRef = useRef(null);

  const handleDateClick = (arg) => {
    console.log("handleDateClick: ", arg);
    alert(arg.dateStr);
  };

  const handleEventClick = (event) => {
    console.log("handleEventClick: ", event);

    event.jsEvent.preventDefault(); // don't let the browser navigate

    setEventInfo({
      id: event.event.id,
      title: event.event.title,
      date: event.event.start?.toLocaleDateString() || "",
    });
    setAnchorEl(event.el); // Attach popover to the clicked event
  };

  const handleClose = () => {
    // setEventInfo(null);
    setAnchorEl(null);
  };

  useEffect(() => {
    console.log("eventInfo: ", eventInfo);
  }, [eventInfo]);

  return (
    <>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={[
          {
            id: "1",
            title: "event 1",
            date: "2025-02-15",
            textColor: "black",
            backgroundColor: "orange",
          },
          { id: "2", title: "event 2", date: "2025-02-17" },
          { id: "3", title: "event 3", date: "2025-02-15" },
          { id: "4", title: "event 4", date: "2025-02-15" },
        ]}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
      />
      <CalendarPopupModal
        open={open}
        setOpen={setOpen}
        popupType={popupType}
        setPopupType={setPopupType}
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
            <Button className="capitalize text-light border-light">Approve</Button>
            <Button className="capitalize text-light border-light">Edit</Button>
            <Button className="capitalize text-light border-light">Delete</Button>
          </ButtonGroup>
        </Box>
      </Popover>
    </>
  );
}
