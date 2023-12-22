import { useAuth } from "@/auth/AuthProvider";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

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
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div
        style={{
          border: "1px solid black",
          borderRadius: "32px",
        }}
        className="bg-[#c9c9c9] space-y-4 min-w-[400px] flex flex-col justify-center items-center p-4"
      >
        <div className="text-center ">Login</div>
        <div>aliiharkous@gmail.com</div>
        <div>Lana250731$</div>
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
              border: "1px solid black",
            }}
          />
        </div>
        <div>
          <input
            placeholder="Password"
            type="text"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="px-2 focus:outline-none"
            style={{
              borderRadius: "10px",
              border: "1px solid black",
            }}
          />
        </div>
        <div>
          <button
            onClick={async (e) => {
              e.preventDefault();
              if (login == null) {
                return;
              }
              await login(email, password);
              push("/private");
            }}
            className="px-4 py-2 bg-white rounded-xl"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};
