"use client";
import dynamic from "next/dynamic";
import { useState, useEffect, MouseEvent } from "react";
import { useDefaultContext } from "@/contexts/DefaultContext";
import { useAuthContext } from "@/contexts/AuthContext";
import { usePropertyContext } from "@/contexts/PropertyContext";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { faSquareCaretDown } from "@fortawesome/free-solid-svg-icons/faSquareCaretDown";
import PropertyPopupModal from "@/components/Property/PropertyPopupModal";
import { fetchAllProperties, deleteProperty } from "@/lib/redis";

const FontAwesomeIcon = dynamic(
  () =>
    import("@fortawesome/react-fontawesome").then((mod) => mod.FontAwesomeIcon),
  { ssr: false } // ✅ Prevents rehydration issues
);

export default function PropertyList() {
  const { isLargeScreen } = useDefaultContext();
  const { user } = useAuthContext();
  const {
    properties,
    currentProperty,
    setOpen,
    setEditProperty,
    setCurrentProperty,
    setProperties,
    handlePropertySelectClick,
    handleClick,
  } = usePropertyContext();

  const handleEditProperty = (propertyId) => {
    const current = properties.find((property) => property.id == propertyId);
    if (current) {
      setEditProperty(current);
      setCurrentProperty(current);
      setOpen(true);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    const result = await deleteProperty(propertyId);

    if (result.message) {
      setProperties((prevProperties) => {
        const updatedProperties = prevProperties.filter(
          (property) => property.id != propertyId
        );
        if (updatedProperties.length > 0) {
          setCurrentProperty(updatedProperties[0]);
        } else {
          setCurrentProperty(null);
        }
        return updatedProperties;
      });
      setValue(0);
    }
  };

  const [value, setValue] = useState(0);

  const handleChange = (propertyId: string, newValue: number) => {
    setValue(newValue);
    handlePropertySelectClick(propertyId);
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    handlePropertySelectClick(event.target.value as string);
  };

  useEffect(() => {
    const init = async () => {
      if (user) {
        const allProperties = await fetchAllProperties(user.id);

        if (allProperties.error) {
          return;
        }

        if (allProperties.message) {
          if (allProperties.message.data.length > 0) {
            setCurrentProperty(allProperties.message.data[0]);
          }
          setProperties(allProperties.message.data);
        }
      }
    };
    init();
  }, []);

  return (
    <div className="border border-dark/10 dark:border-light/10 h-full xl:px-2">
      {isLargeScreen ? (
        <List
          component="nav"
          aria-label="main mailbox folders"
          className="text-dark dark:text-light"
        >
          {properties && properties.length > 0 ? (
            properties.map((property, key) => (
              <ListItemButton
                key={property.id}
                id={property.id}
                selected={value == key}
                onClick={() => handleChange(property.id, key)}
                className={`${
                  value == key &&
                  "bg-dark/10 dark:bg-light/10 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full xl:after:top-0 xl:after:right-0 xl:after:bottom-auto xl:after:left-auto xl:after:h-full xl:after:w-1 after:bg-blue"
                }`}
              >
                <ListItemText primary={property.propertyName} />
                <ListItemIcon>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    className="dark:text-light dark:hover:bg-light/10"
                    onClick={() => handleEditProperty(property.id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    className="dark:text-light dark:hover:bg-light/10"
                    onClick={() => handleDeleteProperty(property.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemIcon>
              </ListItemButton>
            ))
          ) : (
            <ListItemButton key="no-properties" id="no-properties">
              <ListItemText primary="No Properties Found!" />
            </ListItemButton>
          )}
        </List>
      ) : properties && properties.length > 0 ? (
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={currentProperty.id}
          label="Properties"
          onChange={handleSelectChange}
          className="w-full text-dark dark:text-light"
          MenuProps={{
            classes: { paper: "bg-light dark:bg-dark text-dark dark:text-light" },
          }}
          IconComponent={(props) => (
            <FontAwesomeIcon icon={faSquareCaretDown} className="mr-4" />
          )}
        >
          {properties.map((property, key) => (
            <MenuItem key={key} value={property.id}>
              {property.propertyName}
            </MenuItem>
          ))}
        </Select>
      ) : (
        <h3>No Properties</h3>
      )}

      <Button
        className="hidden xl:inline-flex w-full capitalize text-dark dark:text-light border-light bg-dark/10 hover:bg-dark/30 dark:bg-light/10 hover:dark:bg-light/30"
        variant="contained"
        onClick={handleClick}
      >
        <AddIcon />
      </Button>
      <PropertyPopupModal />
    </div>
  );
}
