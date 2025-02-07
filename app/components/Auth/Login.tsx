"use client";
import { useState, useRef, Dispatch, SetStateAction } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToastContext } from "@/contexts/ToastContext";
import { signin } from "@/actions/auth/auth";
import { fetchUser } from "@/lib/redis";
import Button from "@mui/material/Button";

type LoginProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function Login({ open, setOpen }: LoginProps) {
  const { loginUser } = useAuthContext();
  const { createToast, updateToast } = useToastContext();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState(null);

  async function handleSubmit(formData: FormData) {
    const toastId = createToast("Logging in...", "info");
    if (emailRef.current && passwordRef.current) {
      const result = await signin({}, formData);

      if (result?.errors) {
        setError(result.errors);
        updateToast("Something went wrong!", "error", toastId);
      }

      if (!result) {
        const response = await fetchUser(emailRef.current.value);

        if (response.error) {
          console.log(response.error);
          updateToast("Something went wrong!", "error", toastId);
          return;
        }
        console.log('response: ', response);

        if (response.message) {
          const userData = response.message.data;
          const currentUser = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
          };
          if (userData.password.match(passwordRef.current.value)) {
            loginUser(currentUser);
            setOpen(false);
            console.log("Login Successful.");
            updateToast("Login Successful.", "success", toastId);
          } else {
            setError("Email/Password doesn't match.");
            updateToast("Something went wrong!", "error", toastId);
          }
        }
      }
    }
  }
  return (
    <div>
      <form action={handleSubmit}>
        <input
          className="w-full h-8 p-2 my-3 rounded"
          type="email"
          name="email"
          placeholder="Email"
          ref={emailRef}
          required
        />
        <input
          className="w-full h-8 p-2 my-3 rounded"
          type="password"
          name="password"
          placeholder="Password"
          ref={passwordRef}
          required
        />
        <Button
          className="w-full rounded my-3"
          type="submit"
          variant="outlined"
        >
          Login
        </Button>
      </form>
      {/* <input
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
          Login
        </Button> */}
    </div>
  );
}
