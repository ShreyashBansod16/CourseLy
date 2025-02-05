"use client";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import { UserProvider } from "../context/UserContext";
import AuthProvider from "../context/AuthProvider";
import { ResourceProvider } from "../context/ResourceContext";
import { CourseProvider } from "../context/CourseContext";

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
            <UserProvider>
              <ResourceProvider>
                <CourseProvider>{children}</CourseProvider>
              </ResourceProvider>
            </UserProvider>
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
        <UserProvider>
          <ResourceProvider>
            <CourseProvider>{children}</CourseProvider>
          </ResourceProvider>
        </UserProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
