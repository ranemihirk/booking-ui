"use client";
import { useState, useRef, Dispatch, SetStateAction } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToastContext } from "@/contexts/ToastContext";
import { signup } from "@/actions/auth/auth";
import { createUser } from "@/lib/redis";
import Button from "@mui/material/Button";

type RegisterProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function Register({ open, setOpen }: RegisterProps) {
  const { loginUser } = useAuthContext();
  const { createToast, updateToast } = useToastContext();

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState(null);

  async function handleSubmit(formData: FormData) {
    const toastId = createToast("Registering...", "info");
    if (nameRef.current && emailRef.current && passwordRef.current) {
      // Create a FormData object
      // const formData = new FormData();
      // formData.append("name", nameRef.current.value);
      // formData.append("email", emailRef.current.value);
      // formData.append("password", passwordRef.current.value);

      const result = await signup({}, formData);

      if (result?.errors) {
        setError(result.errors);
        updateToast("Something went wrong!", "error", toastId);
      }

      if (!result) {
        const response = await createUser(formData);
        console.log("response: ", response.message);
        if (response.error) {
          console.log(response.error, typeof response.error);
          setError(response.error);
          updateToast("Something went wrong!", "error", toastId);
          return;
        }

        if (response.message) {
          const userData = response.message.data;
          // if (userData.password.match(passwordRef.current.value)) {
          loginUser(userData);
          setOpen(false);
          console.log("Register Successful.");
          updateToast("Register Successful.", "success", toastId);
          // }
        }
      }
    }
  }
  return (
    <div className="">
      <form action={handleSubmit}>
        <input
          className="w-full h-8 p-2 my-3 rounded"
          type="text"
          name="name"
          placeholder="Full Name"
          ref={nameRef}
        />
        <input
          className="w-full h-8 p-2 my-3 rounded"
          type="email"
          name="email"
          placeholder="Email"
          ref={emailRef}
        />
        <input
          className="w-full h-8 p-2 my-3 rounded"
          type="password"
          name="password"
          placeholder="Password"
          ref={passwordRef}
        />
        <Button
          className="w-full rounded my-3"
          type="submit"
          variant="outlined"
        >
          Register
        </Button>
      </form>
      {/* <input
          className="w-full h-8 p-2 my-3 rounded"
          type="text"
          placeholder="Full Name"
          ref={nameRef}
        />
        <input
          className="w-full h-8 p-2 my-3 rounded"
          type="email"
          placeholder="Email"
          ref={emailRef}
        />
        <input
          className="w-full h-8 p-2 my-3 rounded"
          type="password"
          placeholder="Password"
          ref={passwordRef}
        />
        <Button
          className="w-full rounded my-3"
          type="submit"
          variant="outlined"
          onClick={handleSubmit}
        >
          Register
        </Button> */}
    </div>
  );
}
