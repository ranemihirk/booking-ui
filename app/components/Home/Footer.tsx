"use client";
import { useState, MouseEvent } from "react";
import Link from "@mui/material/Link";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToastContext } from "@/contexts/ToastContext";

export default function Footer() {
  const { user, logoutUser } = useAuthContext();
  const { createToast } = useToastContext();

  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <footer className="footer text-lg text-right text-light  p-6">
      Developed by &nbsp;
      <Link
        href="https://www.ranemihirk.com/"
        target="_blank"
        underline="hover"
      >
        Mihir Rane
      </Link>
    </footer>
  );
}
