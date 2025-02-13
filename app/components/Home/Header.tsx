"use client";
import { useState, useEffect, MouseEvent } from "react";
import { useDefaultContext } from "@/contexts/DefaultContext";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToastContext } from "@/contexts/ToastContext";
import Link from "next/link";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Switch, { SwitchProps } from "@mui/material/Switch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons/faPowerOff";
import PopupModal from "@/components/Auth/PopupModal";

export default function Header() {
  const { isDarkMode, toggleDarkMode } = useDefaultContext();
  const { user, logoutUser, init } = useAuthContext();
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

  const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    "& .MuiSwitch-switchBase": {
      margin: 1,
      padding: 0,
      transform: "translateX(6px)",
      "&.Mui-checked": {
        color: "#fff",
        transform: "translateX(22px)",
        "& .MuiSwitch-thumb:before": {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
            "#fff"
          )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
        },
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor: "#aab4be",
          ...theme.applyStyles("dark", {
            backgroundColor: "#8796A5",
          }),
        },
      },
    },
    "& .MuiSwitch-thumb": {
      backgroundColor: isDarkMode ? "#001e3c" : "#FFD700",
      width: 32,
      height: 32,
      "&::before": {
        content: "''",
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
      },
      ...theme.applyStyles("dark", {
        backgroundColor: "#003892",
      }),
    },
    "& .MuiSwitch-track": {
      opacity: 1,
      backgroundColor: "#aab4be",
      borderRadius: 20 / 2,
      ...theme.applyStyles("dark", {
        backgroundColor: "#8796A5",
      }),
    },
  }));

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <header className="header flex flex-col gap-4 xl:flex-row xl:gap-0 justify-between items-center shadow-md shadow-indigo-500/50 p-8 border-b border-dark/20 dark:border-light/20">
        <Link href="/">
          <h1 className="capitalize text-dark dark:text-light font-bold text-3xl">
            booking app
          </h1>
        </Link>

        <div className="flex items-center gap-4">
          <MaterialUISwitch
            sx={{ m: 1 }}
            defaultChecked={isDarkMode}
            onChange={toggleDarkMode}
          />
          <Link
            href="/calendar"
            className="px-4 py-2 border border-blue hover:bg-blue/40 text-blue rounded-lg transition-all delay-150"
          >
            Calendar
          </Link>
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
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                className="size-auto"
              >
                <Avatar className="capitalize bg-dark/80 shadow-inner shadow-blue text-[100%]">
                  {user.name.charAt(0)}{" "}
                </Avatar>
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
            <MenuItem onClick={handleClose} className="bg-dark/80 text-light">
              <Avatar className="bg-dark/80" /> Profile
            </MenuItem>
            <Divider className="m-0" />

            <MenuItem
              onClick={() => {
                logoutUser();
                createToast("Logout Successful.", "success");
              }}
              className="bg-dark/80 text-light"
            >
              <ListItemIcon className="bg-dark/80 min-w-fit p-2 text-light rounded-full mr-2">
                <FontAwesomeIcon icon={faPowerOff} />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </div>
      </header>
      <PopupModal isOpenPopup={isOpenPopup} setIsOpenPopup={setIsOpenPopup} />
    </>
  );
}
