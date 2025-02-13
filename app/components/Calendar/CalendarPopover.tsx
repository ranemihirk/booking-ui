"use client";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { faX } from "@fortawesome/free-solid-svg-icons/faX";
import { useCalendarContext } from "@/contexts/CalendarContext";

export default function CalendarPopover() {
  const {
    anchorEl,
    handleClose,
    handleEditEvent,
    handleDeleteEvent,
    handleApproveEvent,
    handleRejectEvent,
  } = useCalendarContext();

  return (
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
  );
}
