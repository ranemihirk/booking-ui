"use client";
import { useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import DefaultCalendar from "@/components/Calendar/DefaultCalendar";

export default function Home() {
  const { init } = useAuthContext();

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="container text-light">
      <DefaultCalendar />
      {/* <div id="calender"></div> */}
    </div>
  );
}
