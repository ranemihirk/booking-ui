"use client";
import { useState, useEffect, Dispatch, SetStateAction, forwardRef } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons/faCircleXmark";
import Login from "@/components/Auth/Login";
import Register from "@/components/Auth/Register";

type PopupModalProps = {
  isOpenPopup: boolean;
  setIsOpenPopup: Dispatch<SetStateAction<boolean>>;
};

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PopupModal({
  isOpenPopup,
  setIsOpenPopup,
}: PopupModalProps) {
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
    // <motion.div
    //   initial={{ opacity: 0 }}
    //   animate={{ opacity: isOpenPopup ? 1 : 0 }}
    //   transition={{ duration: 0.25 }}
    //   className={`${
    //     isOpenPopup ? "flex" : "hidden"
    //   } flex-col justify-center items-center size-full fixed top-0 left-0 bg-blue-500/50 z-20`}
    // >
    //   <div className="relative flex flex-col bg-slate-800 p-6 rounded-md max-h-[80%] max-w-[60%]">
    //     <Button
    //       className="rounded-full p-0 m-0 min-w-fit absolute top-2 right-2"
    //       onClick={() => {
    //         setIsOpenPopup(!isOpenPopup);
    //         setPopupType(initialValue);
    //       }}
    //     >
    //       <FontAwesomeIcon icon={faCircleXmark} size="2xl" />
    //     </Button>
    //     {popupType == "login" && <Login open={isOpenPopup} setOpen={setIsOpenPopup} />}
    //     {popupType == "register" && <Register open={isOpenPopup} setOpen={setIsOpenPopup} />}
    //     <Divider className="bg-slate-500" />
    //     {popupType == "login" && (
    //       <Button size="small" className="mt-3 text-slate-100" onClick={() => setPopupType("register")}>
    //         I don&apos;t have an account. <br /> Create one?
    //       </Button>
    //     )}
    //     {popupType == "register" && (
    //       <Button size="small" className="mt-3 text-slate-100" onClick={() => setPopupType("login")}>
    //         I have an account.
    //       </Button>
    //     )}
    //   </div>
    // </motion.div>
    <Dialog open={isOpenPopup} TransitionComponent={Transition} onClose={() => setIsOpenPopup(false)}>
      <div className="flex justify-between items-center">
        <DialogTitle className="capitalize">{popupType}</DialogTitle>
        <Button
          className="rounded-full p-0 m-0 mr-4 min-w-fit"
          onClick={() => {
            setIsOpenPopup(!isOpenPopup);
            setPopupType(initialValue);
          }}
        >
          <FontAwesomeIcon icon={faCircleXmark} size="2xl" />
        </Button>
      </div>
      <DialogContent className="bg-dark">
        {popupType == "login" && (
          <Login open={isOpenPopup} setOpen={setIsOpenPopup} />
        )}
        {popupType == "register" && (
          <Register open={isOpenPopup} setOpen={setIsOpenPopup} />
        )}
        <Divider className="bg-slate-500" />
        <div className="text-dark text-center">
          {popupType == "login" && (
            <Button
              size="small"
              className="mt-3 border border-slate-500"
              onClick={() => setPopupType("register")}
            >
              I don&apos;t have an account. <br /> Create one?
            </Button>
          )}
          {popupType == "register" && (
            <Button
              size="small"
              className="mt-3 border border-slate-500"
              onClick={() => setPopupType("login")}
            >
              I have an account.
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
