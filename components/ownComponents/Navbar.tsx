'use client'

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ModeToggle } from "./ToggleTheme";

export default function Navbar() {
  const loggedIn = false;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-gray-600 text-white shadow-md">
      <div className="flex items-center justify-between p-4">
        {/* Navbar Logo */}
        <div className="text-2xl font-bold">
          <Link href="/">Vi-Dash</Link>
        </div>

        
        <div className="md:hidden">
          <button
            className="text-white focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        
        <div className="hidden md:flex items-center gap-6 text-lg font-semibold">
          <Link href="/">Home</Link>
          <Link href="/pages/courses/allcourses">Courses</Link>
          <Link href="/pages/resources/allresource">Resources</Link>
          <Link href="/contact">Contact</Link>

          {!loggedIn ? (
            <div className="flex items-center gap-4">
              <ModeToggle />
              <Link href="/user/login">Login</Link>
              <Link href="/user/signup">SignUp</Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <ModeToggle />
              <Link href="/api/auth/logout">Logout</Link>
            </div>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-gray-700 text-white">
          <div className="flex flex-col items-center gap-4 py-4 text-lg font-semibold">
            <Link href="/" onClick={toggleMenu}>
              Home
            </Link>
            <Link href="/pages/courses/allcourses" onClick={toggleMenu}>
              Courses
            </Link>
            <Link href="/pages/resources/allresource" onClick={toggleMenu}>
              Resources
            </Link>
            <Link href="/contact" onClick={toggleMenu}>
              Contact
            </Link>

            {!loggedIn ? (
              <div className="flex flex-col items-center gap-4">
                <ModeToggle />
                <Link href="/user/login" onClick={toggleMenu}>
                  Login
                </Link>
                <Link href="/user/signup" onClick={toggleMenu}>
                  SignUp
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <ModeToggle />
                <Link href="/api/auth/logout" onClick={toggleMenu}>
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
