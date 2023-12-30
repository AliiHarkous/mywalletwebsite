import { useAuth } from "@/auth/AuthProvider";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "./Button";

export const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { user, login, logout } = useAuth();
  const { push } = useRouter();
  useEffect(() => {
    if (user != null) {
      return push("/private");
    }
  }, [user]);

  return (
    <div className="flex container min-h-screen flex-col items-center justify-center p-24 text-4xl">
      <div
        style={{
          borderRadius: "20px",
          backgroundColor: "#edf0f3",
          boxShadow: "1px 1px 1px 2px  rgba(0, 0, 0, 0.1)",
        }}
        className="space-y-4 flex flex-col justify-center items-center p-4"
      >
        <div className="text-center ">Login</div>
        <div>
          <input
            placeholder="Email"
            type="text"
            value={email}
            autoComplete="true"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="px-2 focus:outline-none"
            style={{
              borderRadius: "10px",
              fontSize: "20px",
              border: "1px solid black",
            }}
          />
        </div>
        <div>
          <input
            placeholder="Password"
            type="text"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="px-2 focus:outline-none"
            style={{
              borderRadius: "10px",
              border: "1px solid black",
              fontSize: "20px",
            }}
          />
        </div>
        <div>
          <Button
            onClick={async () => {
              if (login == null) {
                return;
              }
              await login(email, password);
              push("/private");
            }}
            style={{
              backgroundColor: "black",
              color: "white",
              fontSize: "14px",
            }}
            value={<div>Sign in</div>}
          />
        </div>
      </div>
    </div>
  );
};
