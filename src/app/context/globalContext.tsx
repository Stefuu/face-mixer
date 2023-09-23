"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

interface GlobalValue {
  pdp1: string | null;
  pdp2: string | null;
  setPdp1: React.Dispatch<React.SetStateAction<string | null>>;
  setPdp2: React.Dispatch<React.SetStateAction<string | null>>;
}

const Global = createContext<any | null>(null);

export function useGlobal() {
  const value = useContext(Global);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useGlobal must be wrapped in a <GlobalProvider />");
    }
  }

  return value;
}

export function GlobalProvider({ children }: { children: React.ReactNode }) {
  const [pdp1, setPdp1] = useState<string | null>(null);
  const [pdp2, setPdp2] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) setEmail(email);
  }, []);

  return (
    <Global.Provider
      value={{
        email,
        setEmail,
        pdp1,
        pdp2,
        setPdp1,
        setPdp2,
      }}
    >
      {children}
    </Global.Provider>
  );
}
