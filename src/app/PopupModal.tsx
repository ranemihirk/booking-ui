"use client";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons/faCircleXmark";
import Login from "./Login";
import Register from "./Register";

type PopupModalProps = {
  isOpenPopup: boolean;
  setIsOpenPopup: Dispatch<SetStateAction<boolean>>;
};

export default function PopupModal({
  isOpenPopup,
  setIsOpenPopup,
}: PopupModalProps): JSX.Element {
  const initialValue = "login";
  const [popupType, setPopupType] = useState(initialValue);

  useEffect(() => {
    return () => {
      // Perform cleanup here, unsubscribe from subscriptions, clear timers, etc.
      // This ensures that any resources used by the effect are properly cleaned up
      setPopupType(initialValue);
    };
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpenPopup ? 1 : 0 }}
      transition={{ duration: 0.25 }}
      className={`${
        isOpenPopup ? "flex" : "hidden"
      } flex-col justify-center items-center size-full fixed top-0 left-0 bg-blue-500/50`}
    >
      <div className="relative flex flex-col bg-slate-800 p-6 rounded-md max-h-[80%] max-w-[60%]">
        <Button
          className="rounded-full p-0 m-0 min-w-fit absolute top-2 right-2"
          onClick={() => {
            setIsOpenPopup(!isOpenPopup);
            setPopupType(initialValue);
          }}
        >
          <FontAwesomeIcon icon={faCircleXmark} size="2xl" />
        </Button>
        {popupType == "login" && <Login />}
        {popupType == "register" && <Register />}
        <Divider className="bg-slate-500" />
        {popupType == "login" && (
          <Button size="small" className="mt-3 text-slate-100" onClick={() => setPopupType("register")}>
            I don&apos;t have an account. <br /> Create one?
          </Button>
        )}
        {popupType == "register" && (
          <Button size="small" className="mt-3 text-slate-100" onClick={() => setPopupType("login")}>
            I have an account.
          </Button>
        )}
      </div>
    </motion.div>
  );
}
