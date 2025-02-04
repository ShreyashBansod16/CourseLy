"use client";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import { UserProvider } from "../context/UserContext";
import AuthProvider from "../context/AuthProvider";

export default function Providers({ children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <html lang="en">
        <body>
          <AuthProvider>
            <UserProvider>{children}</UserProvider>
          </AuthProvider>
        </body>
      </html>
    );
  }
  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem={true}
        disableTransitionOnChange
      >
        <UserProvider>{children}</UserProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
