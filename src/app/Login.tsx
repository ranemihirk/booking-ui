"use client";
import { useRef } from "react";
import Button from "@mui/material/Button";

export default function Login(): JSX.Element {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    // Perform login logic here, e.g., sending login request to your backend
  };
  return (
    <>
      <h3 className="text-2xl font-bold mb-2">Login</h3>
      <div>
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
          Login
        </Button>
      </div>
    </>
  );
}
