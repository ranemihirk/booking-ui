"use client";
import { useState, useEffect, cloneElement } from "react";
import { useDefaultContext } from "@/contexts/DefaultContext";
import { usePropertyContext } from "@/contexts/PropertyContext";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PropertyPopupModal from "@/components/Property/PropertyPopupModal";
import { fetchAllProperties, deleteProperty } from "@/lib/redis";

export default function PropertyList() {
  const { isLargeScreen } = useDefaultContext();
  const {
    properties,
    currentProperty,
    editProperty,
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

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    handlePropertySelectClick(event.target.id);
  };

  useEffect(() => {
    const init = async () => {
      const allProperties = await fetchAllProperties();

      if (allProperties.error) {
        return;
      }

      if (allProperties.message) {
        if (allProperties.message.data.length > 0) {
          setCurrentProperty(allProperties.message.data[0]);
        }
        setProperties(allProperties.message.data);
      }
    };
    init();
  }, []);

  return (
    <div className="border border-dark/10 dark:border-light/10 h-full xl:px-2">
      <Tabs
        orientation={isLargeScreen ? "vertical" : "horizontal"}
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: "divider" }}
      >
        {properties && properties.length > 0 ? (
          properties.map((property, key) => (
            <Tab
              label={property.propertyName}
              id={property.id}
              icon={
                <div>
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
                </div>
              }
              iconPosition="end"
              className={`rounded ${
                key === value && "bg-dark/10 dark:bg-light/10"
              } justify-between border border-light/20 text-dark dark:text-light hover:bg-dark/20 dark:hover:bg-light/20 cursor-pointer`}
            />
          ))
        ) : (
          <Tab label="No Properties Found!" />
        )}
      </Tabs>
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
