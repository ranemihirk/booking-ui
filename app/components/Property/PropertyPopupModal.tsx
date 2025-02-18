"use client";
import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  Dispatch,
  SetStateAction,
} from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToastContext } from "@/contexts/ToastContext";
import { usePropertyContext } from "@/contexts/PropertyContext";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Button from "@mui/material/Button";
import { TransitionProps } from "@mui/material/transitions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons/faCircleXmark";
import { PropertyProp } from "@/lib/types";
import { fetchProperty, createProperty } from "@/lib/redis";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PropertyPopupModal() {
  const { user } = useAuthContext();
  const { createToast, updateToast } = useToastContext();
  const { open, editProperty, setOpen, setProperties, setEditProperty } =
    usePropertyContext();

  const userIdRef = useRef<HTMLInputElement>(null);
  const propertyIdRef = useRef<HTMLInputElement>(null);
  const propertyNameRef = useRef<HTMLInputElement>(null);
  const maxOccupancyRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState(null);
  const [userId, setUserId] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [propertyTitle, setPropertyTitle] = useState("");
  const [maxOccupancy, setMaxOccupancy] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  async function handleSubmit(formData: FormData) {
    const toastId = createToast("Adding Property...", "info");
    if (propertyNameRef.current && maxOccupancyRef.current) {
      const { propertyId } = Object.fromEntries(formData);
      const isNewproperty = propertyId == "";
      const response = await createProperty(formData);
      
      if (response.error) {
        console.log(response.error, typeof response.error);
        setError(response.error);
        updateToast("Something went wrong!", "error", toastId);
        return;
      }
      if (response.message) {
        const responseData = response.message.data;
        const propertyData: PropertyProp = {
          id: responseData.id,
          propertyName: responseData.name,
          maxOccupancy: responseData.maxOccupancy,
          location: responseData.location,
          description: responseData.description,
          status: responseData.status,
        };
        setOpen(false);
        resetValues();
        setProperties((prevProperties) => {
          if (isNewproperty) {
            const newpropertys: PropertyProp[] = [
              ...prevProperties,
              propertyData,
            ];
            return newpropertys;
          } else {
            const newpropertys: PropertyProp[] = prevProperties.map(
              (property) =>
                property.id == propertyData.id ? propertyData : property
            );
            return newpropertys;
          }
        });
        console.log("Property Added Successful.");
        updateToast(`Property ${editProperty ? "Edited" : "Added"} Successful.`, "success", toastId);
      }
    }
  }

  const resetValues = () => {
    setOpen(false);
    setPropertyTitle("");
    setMaxOccupancy("");
    setLocation("");
    setDescription("");
    setIsAvailable(false);
  };

  useEffect(() => {
    if (!open) return;
    const initProperty = async () => {
      if (!user) return;
      setUserId(user.id);
      if (editProperty) {
        setPropertyId(editProperty.id);
        setPropertyTitle(editProperty.propertyName);
        setMaxOccupancy(editProperty.maxOccupancy.toString());
        setLocation(editProperty.location);
        setDescription(editProperty.description);
        setIsAvailable(editProperty.status);
      }
    };

    initProperty();
  }, [open]);

  return (
    <Dialog open={open} TransitionComponent={Transition} onClose={resetValues}>
      <div className="flex justify-between items-center">
        <DialogTitle className="capitalize">Property Details</DialogTitle>
        <Button
          className="rounded-full p-0 m-0 mr-4 min-w-fit"
          onClick={resetValues}
        >
          <FontAwesomeIcon icon={faCircleXmark} size="2xl" />
        </Button>
      </div>
      <DialogContent className="bg-dark">
        <form action={handleSubmit}>
          <input
            className="w-full h-8 p-2 my-3 rounded"
            type="hidden"
            name="userId"
            value={userId}
            ref={userIdRef}
          />
          <input
            className="w-full h-8 p-2 my-3 rounded"
            type="hidden"
            name="propertyId"
            value={propertyId}
            ref={propertyIdRef}
          />
          <input
            className="w-full h-8 p-2 my-3 rounded"
            type="text"
            name="propertyName"
            placeholder="Property Name"
            defaultValue={propertyTitle}
            ref={propertyNameRef}
            required
          />
          <input
            className="w-full h-8 p-2 my-3 rounded"
            type="text"
            name="maxOccupancy"
            placeholder="Max Occupancy"
            defaultValue={maxOccupancy}
            ref={maxOccupancyRef}
            required
          />
          <input
            className="w-full h-8 p-2 my-3 rounded"
            type="text"
            name="location"
            placeholder="Location"
            defaultValue={location}
            ref={locationRef}
            required
          />
          <input
            className="w-full h-8 p-2 my-3 rounded"
            type="text"
            name="description"
            placeholder="Description (optional)"
            defaultValue={description}
            ref={descriptionRef}
          />
          <div className="flex items-center">
            <input
              className="p-2 my-3 mr-3 rounded"
              type="checkbox"
              name="status-checkbox"
              value={isAvailable ? "on" : "off"}
              ref={statusRef}
              checked={isAvailable}
              onChange={() => setIsAvailable(!isAvailable)}
            />
            <input
              className="p-2 my-3 mr-3 rounded"
              type="hidden"
              name="status"
              value={isAvailable ? "on" : "off"}
            />
            <label htmlFor="status" className="text-dark dark:text-light">
              Is Available
            </label>
          </div>
          <Button
            className="w-full rounded my-3"
            type="submit"
            variant="outlined"
          >
            {propertyId != "" ? "Edit" : "Add"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
