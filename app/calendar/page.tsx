"use client";
import { Suspense } from "react";
import dynamic from "next/dynamic";
// import DefaultCalendar from "@/components/Calendar/DefaultCalendar";
// import PropertyList from "@/components/Property/PropertyList";
import Button from "@mui/material/Button";
import { deleteAllEvents } from "@/lib/redis";
import { useToastContext } from "@/contexts/ToastContext";
import { usePropertyContext } from "@/contexts/PropertyContext";
import AddIcon from "@mui/icons-material/Add";

const DefaultCalendar = dynamic(
  () => import("@/components/Calendar/DefaultCalendar").then((mod) => mod),
  { ssr: false } // ✅ Prevents rehydration issues
);

const PropertyList = dynamic(
  () => import("@/components/Property/PropertyList").then((mod) => mod),
  { ssr: false } // ✅ Prevents rehydration issues
);

export default function Calendar() {
  const { createToast } = useToastContext();
  const { currentProperty, handleClick } = usePropertyContext();

  const handleDeleteAllEvents = async () => {
    const result = await deleteAllEvents(currentProperty.id);
    if (result.message) {
      createToast(result.message.data, "success");
      // setEvents([]);
    }
  };
  return (
    <Suspense fallback={<div className="text-gray-500">Loading...</div>}>
      <div className="container py-4 xl:py-8">
        <div className="flex justify-evenly">
          <Button
            className="hidden capitalize text-light border-light"
            variant="contained"
            onClick={handleClick}
          >
            <AddIcon /> Add Property
          </Button>
          <Button
            className={`${process.env.NODE_ENV == "production" && 'hidden'} capitalize text-light border-light`}
            variant="contained"
            onClick={handleDeleteAllEvents}
          >
            Delete All Events
          </Button>
        </div>
        <div className="flex gap-4 h-full text-light py-4 xl:py-8">
          <div className="w-[30%] border border-dark/10 dark:border-light/10 shadow-md dark:shadow-light/50 p-4">
            <PropertyList />
          </div>
          <div className="grow h-full text-dark dark:text-light">
            <DefaultCalendar />
          </div>
          {/* <div id="calender"></div> */}
        </div>
      </div>
    </Suspense>
  );
}
