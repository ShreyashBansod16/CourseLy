"use client";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import { UserProvider } from "../context/UserContext";

export default function Providers({ children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <html lang="en">
        <body>
          <UserProvider>{children}</UserProvider>
        </body>
      </html>
    );
  }
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
      disableTransitionOnChange
    >
      <UserProvider>{children}</UserProvider>
    </ThemeProvider>
  );
}
