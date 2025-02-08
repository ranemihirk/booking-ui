"use client";
import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  Dispatch,
  SetStateAction,
} from "react";
import { useToastContext } from "@/contexts/ToastContext";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { TransitionProps } from "@mui/material/transitions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons/faCircleXmark";
import { createevent } from "@/actions/calendar/calendar";
import { createEvent, fetchEvent } from "@/lib/redis";
import { EventInfoProp, EventProp } from "@/lib/types";

type CalendarPopupModalProps = {
  open: boolean;
  eventInfo: EventInfoProp | null;
  events: EventProp[];
  setOpen: Dispatch<SetStateAction<boolean>>;
  setEvents: Dispatch<SetStateAction<EventProp[]>>;
};

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CalendarPopupModal({
  open,
  eventInfo,
  events,
  setOpen,
  setEvents,
}: CalendarPopupModalProps) {
  const { createToast, updateToast } = useToastContext();

  const eventIdRef = useRef<HTMLInputElement>(null);
  const eventNameRef = useRef<HTMLInputElement>(null);
  const numberOfPeopleRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLInputElement>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const commentsRef = useRef<HTMLInputElement>(null);
  const createdAtRef = useRef<HTMLInputElement>(null);
  const updatedAtRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState(null);
  const [eventId, setEventId] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [numberOPeople, setNumberOPeople] = useState("");
  const [comments, setComments] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endDateDisplay, setEndDateDisplay] = useState("");

  async function handleSubmit(formData: FormData) {
    const toastId = createToast("Adding Event...", "info");
    if (eventNameRef.current && numberOfPeopleRef.current) {
      const response = await createEvent(formData);
      if (response.error) {
        console.log(response.error, typeof response.error);
        setError(response.error);
        updateToast("Something went wrong!", "error", toastId);
        return;
      }
      if (response.message) {
        const responseData = response.message.data;
        const userData: EventProp = {
          id: responseData.id,
          title: responseData.title,
          start: responseData.start,
          end: responseData.end,
          extendedProps: responseData.extendedProps,
        };
        setOpen(false);
        setEvents((prevEvents) => {
          const newEvents: EventProp[] = [userData, ...prevEvents];
          return newEvents;
        });
        console.log("Event Added Successful.");
        updateToast("Event Added Successful.", "success", toastId);
      }
    }
  }

  const onDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDateDisplay(
      new Date(e.target.value).toLocaleDateString("en-CA").split("T")[0]
    );
    setEndDate(e.target.value);
  };

  useEffect(() => {
    if (!open || !eventInfo) return;
    const initEvent = async () => {
      if (eventInfo) {
        console.log("eventInfo: ", eventInfo);
        setEventId(eventInfo.id);
        const result = await fetchEvent(eventInfo.id);

        if (!result.error) {
          const currentEvent = result.message.data;
          console.log("currentEvent: ", currentEvent);
          setEventTitle(currentEvent.title);
          setNumberOPeople(currentEvent.extendedProps.numberOPeople);
          setComments(currentEvent.extendedProps.comments);
          setStartDate(currentEvent.start);
          setEndDate(currentEvent.end);
          setEndDateDisplay(
            new Date(currentEvent.end).toLocaleDateString("en-CA").split("T")[0]
          );
        } else {
          const startDateFormat = new Date(eventInfo.start);
          const endDateFormat = new Date(eventInfo.start);
          endDateFormat.setDate(endDateFormat.getDate() + 1);
          setStartDate(eventInfo.start);
          setEndDate(
            `${endDateFormat.getFullYear()}-${
              endDateFormat.getMonth() + 1
            }-${endDateFormat.getDate()}`
          );
          setEndDateDisplay(
            new Date(
              `${endDateFormat.getFullYear()}-${
                endDateFormat.getMonth() + 1
              }-${endDateFormat.getDate()}`
            )
              .toLocaleDateString("en-CA")
              .split("T")[0]
          );
        }
      }
    };

    initEvent();
  }, [open, eventInfo]);

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      onClose={() => setOpen(false)}
    >
      <div className="flex justify-between items-center">
        <DialogTitle className="capitalize">Event Details</DialogTitle>
        <Button
          className="rounded-full p-0 m-0 mr-4 min-w-fit"
          onClick={() => {
            setOpen(!open);
          }}
        >
          <FontAwesomeIcon icon={faCircleXmark} size="2xl" />
        </Button>
      </div>
      <DialogContent className="bg-dark">
        <form action={handleSubmit}>
          <input
            className="w-full h-8 p-2 my-3 rounded"
            type="hidden"
            name="eventId"
            value={eventId}
            ref={eventIdRef}
          />
          <input
            className="w-full h-8 p-2 my-3 rounded"
            type="hidden"
            name="status"
            value={0}
            ref={statusRef}
          />
          <input
            className="w-full h-8 p-2 my-3 rounded"
            type="hidden"
            name="endDate"
            value={endDate}
          />
          <input
            className="w-full h-8 p-2 my-3 rounded"
            type="text"
            name="eventName"
            placeholder="Event Name"
            defaultValue={eventTitle}
            ref={eventNameRef}
            required
          />
          <input
            className="w-full h-8 p-2 my-3 rounded"
            type="text"
            name="numberOfPeople"
            placeholder="Number of People"
            defaultValue={numberOPeople}
            ref={numberOfPeopleRef}
            required
          />
          <input
            className="w-full h-8 p-2 my-3 rounded bg-gray/80 cursor-not-allowed"
            type="text"
            name="startDate"
            value={startDate}
            ref={startDateRef}
            readOnly
          />
          <input
            className="w-full h-8 p-2 my-3 rounded"
            type="date"
            name="endDateDisplay"
            defaultValue={endDateDisplay}
            min={endDateDisplay}
            ref={endDateRef}
            onChange={onDateChange}
          />
          <input
            className="w-full h-8 p-2 my-3 rounded"
            type="text"
            name="comments"
            placeholder="Comments (optional)"
            defaultValue={comments}
            ref={commentsRef}
          />
          <Button
            className="w-full rounded my-3"
            type="submit"
            variant="outlined"
          >
            Add
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
