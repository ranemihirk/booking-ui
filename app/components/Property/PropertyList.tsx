"use client";
import { useState, useEffect, cloneElement } from "react";
import { usePropertyContext } from "@/contexts/PropertyContext";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PropertyPopupModal from "@/components/Property/PropertyPopupModal";
import { fetchAllProperties, deleteProperty } from "@/lib/redis";

export default function PropertyList() {
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
    // handlePropertySelectClick(propertyId);
    setEditProperty(properties.find((property) => property.id == propertyId));
    setOpen(true);
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
    }
  };

  useEffect(() => {
    const init = async () => {
      const allProperties = await fetchAllProperties();

      if (allProperties.error) {
        return;
      }

      if (allProperties.message) {
        console.log("allProperties: ", allProperties.message.data);
        if (allProperties.message.data.length > 0) {
          setCurrentProperty(allProperties.message.data[0]);
        }
        setProperties(allProperties.message.data);
      }
    };
    init();
  }, []);

  return (
    <div className="border border-dark/10 dark:border-light/10 h-full px-2">
      <List>
        {properties && properties.length > 0 ? (
          properties.map((property) => (
            <ListItem
              onClick={() => {
                handlePropertySelectClick(property.id);
              }}
              key={property.id}
              className={`rounded ${
                property.id === currentProperty?.id &&
                (currentProperty?.status
                  ? "bg-dark/10 dark:bg-light/10"
                  : "bg-gray")
              } ${
                !currentProperty?.status && "bg-gray"
              } border-b border-light/10 text-dark dark:text-light hover:bg-dark/20 dark:hover:bg-light/20 cursor-pointer`}
              secondaryAction={
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
            >
              <ListItemText primary={property.propertyName} />
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText primary="No Properties" />
          </ListItem>
        )}
      </List>
      <Button
        className="w-full capitalize text-dark dark:text-light border-light bg-dark/10 hover:bg-dark/30 dark:bg-light/10 hover:dark:bg-light/30"
        variant="contained"
        onClick={handleClick}
      >
        <AddIcon />
      </Button>
      <PropertyPopupModal />
    </div>
  );
}
