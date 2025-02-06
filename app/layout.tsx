import type { Metadata } from "next";
import "./globals.css";
import  Providers  from "./provider/Providers";
import Navbar from "@/components/ownComponents/Navbar";

export const metadata: Metadata = {
  title: "CourseLy",
  description: "CourseLy is a platform for learning and teaching online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
