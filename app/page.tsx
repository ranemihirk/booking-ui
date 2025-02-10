"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons/faArrowRight";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import useMediaQuery from "@mui/material/useMediaQuery";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Home() {
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };
  return (
    <>
      <section className="landscape:max-lg:h-full h-[80vh] xl:h-screen w-full">
        <div className="relative h-full xl:h-[75%]">
          <img
            src="/assets/images/home.jpg"
            alt=""
            className="size-full object-cover object-top"
          />
          {/* Overlay */}
          <div className="z-10 absolute inset-0 bg-black bg-opacity-50 size-full"></div>
          <div className="z-20 absolute inset-0 h-[50%] xl:h-full flex justify-center items-center size-full">
            <div className="px-8 py-4 md::px-16 md:py-8 rounded-xl bg-light/40">
              <h1 className="text-2xl md:text-4xl lg::text-6xl mb-8">
                Hey Buddy! where are you <br />
                <span className="capitalize font-bold">staying</span> at?
              </h1>
              <p className="">
                Explore Now{" "}
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="ml-4"
                  size="sm"
                />
              </p>
            </div>
          </div>
          {/* -bottom-[60%] md:-bottom-[20%] lg:-bottom-[14%] */}
          {/* Booking Form */}
          <div className="z-20 absolute bottom-0 xl:-bottom-[9%] left-0 w-full flex items-center justify-center">
            <div className="container rounded-xl">
              <div className="relative text-center xl:text-left">
                <div className="bg-light rounded-xl p-4 xl:p-8">
                  <div className="flex flex-col xl:flex-row gap-4 items-center">
                    <TextField
                      id="location"
                      label="Location"
                      variant="outlined"
                      className="grow w-full xl:w-auto"
                    />
                    <div className="relative w-full xl:w-[50%] flex flex-col xl:flex-row gap-4">
                      <TextField
                        id="check-in"
                        label="Check-In"
                        variant="outlined"
                        className="grow w-full xl:w-auto"
                      />
                      <TextField
                        id="check-out"
                        label="Check-Out"
                        variant="outlined"
                        className="grow w-full xl:w-auto"
                      />
                      <div
                        className={`${
                          open ? "block" : "hidden"
                        } absolute top-[100%] text-center w-full`}
                      >
                        <DatePicker
                          selected={startDate}
                          onChange={onChange}
                          startDate={startDate}
                          endDate={endDate}
                          selectsRange
                          monthsShown={isLargeScreen ? 2 : 1} // ✅ Shows 2 months
                          inline // ✅ Displays the calendar inline
                          className="w-full"
                        />
                      </div>
                    </div>
                    <Button
                      variant="contained"
                      className="grow w-[150px] xl:w-auto"
                      onClick={() => setOpen(!open)}
                    >
                      Book
                    </Button>
                  </div>
                </div>
                <div className="absolute -bottom-5 xl:-bottom-[20%] text-center w-full">
                  <h3></h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
