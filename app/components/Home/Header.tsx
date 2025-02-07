"use client";
import { useState, MouseEvent } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons/faPowerOff";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToastContext } from "@/contexts/ToastContext";
import PopupModal from "@/components/Auth/PopupModal";

export default function Header() {
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
    <>
      <header className="header flex justify-between items-center shadow-md shadow-indigo-500/50 p-8">
        <h1 className="capitalize text-light font-bold text-3xl">
          booking app
        </h1>
        {!user ? (
          <Button
            className="capitalize text-lg"
            variant="outlined"
            onClick={() => setIsOpenPopup(!isOpenPopup)}
          >
            Login / Sign Up
          </Button>
        ) : (
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleClick}
              size="small"
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              {!user ? (
                <Avatar className="bg-dark/80" />
              ) : (
                <Avatar className="capitalize bg-dark/80">
                  {user.name.charAt(0)}{" "}
                </Avatar>
              )}
            </IconButton>
          </Tooltip>
        )}

        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={handleClose}>
            <Avatar className="bg-dark/80" /> Profile
          </MenuItem>
          <Divider />

          <MenuItem
            onClick={() => {
              logoutUser();
              createToast("Logout Successful.", "success");
            }}
            className={`${!user && "hidden"}`}
          >
            <ListItemIcon className="bg-dark/80 min-w-fit p-2 text-light rounded-full mr-2">
              <FontAwesomeIcon icon={faPowerOff} />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </header>
      <PopupModal isOpenPopup={isOpenPopup} setIsOpenPopup={setIsOpenPopup} />
    </>
  );
}
