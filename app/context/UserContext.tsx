"use client";
import { createContext, useContext, useState } from "react";

const UserContext = createContext<any>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const loggedIn = false;
  const [name, setName] = useState<string | null>("user");

  return (
    <UserContext.Provider value={{ loggedIn, name, setName }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
