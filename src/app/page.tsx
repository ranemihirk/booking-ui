"use client";
import { useState } from "react";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import PopupModal from "./PopupModal";

export default function Home() {
  const [isOpenPopup, setIsOpenPopup] = useState(true);
  return (
    <main className="min-h-screen p-6 flex flex-col">
      <div className="header flex justify-between items-center shadow-md shadow-indigo-500/50 px-4 py-6">
        <h1 className="capitalize font-bold text-3xl">booking app</h1>
        <Button
          className="capitalize text-lg"
          variant="outlined"
          onClick={() => setIsOpenPopup(!isOpenPopup)}
        >
          Login / Sign Up
        </Button>
      </div>
      <div className="body flex justify-center items-center grow">
        <h2>This is a demo booking app.</h2>
      </div>
      <div className="footer text-lg text-right">
        Developed by &nbsp;
        <Link
          href="https://www.ranemihirk.com/"
          target="_blank"
          underline="hover"
        >
          Mihir Rane
        </Link>
      </div>
      <PopupModal isOpenPopup={isOpenPopup} setIsOpenPopup={setIsOpenPopup} />
    </main>
  );
}
