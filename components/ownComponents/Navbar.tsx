"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ModeToggle } from "./ToggleTheme";
import { useUser } from "@/app/context/UserContext";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";

export default function Navbar() {
  const { userData, loading } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-background border-b shadow-sm">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Navbar Logo */}
        <div className="text-xl font-bold text-foreground">
          <Link href="/">CourseLy-{userData?.name.toUpperCase() || "User"}</Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            className="text-foreground focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-lg font-medium">
          <Link href="/" className="text-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/courses/allcourses" className="text-foreground hover:text-primary transition-colors">
            Courses
          </Link>
          <Link href="/resources/allresource" className="text-foreground hover:text-primary transition-colors">
            Resources
          </Link>
          <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
            Contact
          </Link>

          {!(userData || false) ? (
            <div className="flex items-center gap-4">
              <ModeToggle />
              <Link href="/user/login" className="text-foreground hover:text-primary transition-colors">
                Login
              </Link>
              <Link href="/user/signup" className="text-foreground hover:text-primary transition-colors">
                SignUp
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <ModeToggle />
              <Button onClick={()=>signOut()} className="text-foreground hover:text-primary transition-colors">
              Logout
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t">
          <div className="flex flex-col items-center gap-4 py-4 text-lg font-medium">
            <Link href="/" onClick={toggleMenu} className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/courses/allcourses" onClick={toggleMenu} className="text-foreground hover:text-primary transition-colors">
              Courses
            </Link>
            <Link href="/resources/allresource" onClick={toggleMenu} className="text-foreground hover:text-primary transition-colors">
              Resources
            </Link>
            <Link href="/contact" onClick={toggleMenu} className="text-foreground hover:text-primary transition-colors">
              Contact
            </Link>

            {!(userData || false) ? (
              <div className="flex flex-col items-center gap-4">
                <ModeToggle />
                <Link href="/user/login" onClick={toggleMenu} className="text-foreground hover:text-primary transition-colors">
                  Login
                </Link>
                <Link href="/user/signup" onClick={toggleMenu} className="text-foreground hover:text-primary transition-colors">
                  SignUp
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <ModeToggle />
                <Button onClick={()=>{signOut(),toggleMenu()}} className="text-foreground hover:text-primary transition-colors">
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}