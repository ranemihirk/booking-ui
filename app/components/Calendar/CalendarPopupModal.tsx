"use client";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons/faCircleXmark";
import Login from "@/components/Auth/Login";
import Register from "@/components/Auth/Register";

type PopupModalProps = {
  open: boolean;
  popupType: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setPopupType: Dispatch<SetStateAction<string>>;
};

export default function CalendarPopupModal({
  open,
  setOpen,
  popupType,
  setPopupType,
}: PopupModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: open ? 1 : 0 }}
      transition={{ duration: 0.25 }}
      className={`${
        open ? "flex" : "hidden"
      } flex-col justify-center items-center size-full fixed top-0 left-0 bg-blue-500/50`}
    >
      <div className="relative flex flex-col bg-slate-800 p-6 rounded-md max-h-[80%] max-w-[60%]">
        <Button
          className="rounded-full p-0 m-0 min-w-fit absolute top-2 right-2"
          onClick={() => {
            setOpen(!open);
            setPopupType("");
          }}
        >
          <FontAwesomeIcon icon={faCircleXmark} size="2xl" />
        </Button>
      </div>
    </motion.div>
  );
}
