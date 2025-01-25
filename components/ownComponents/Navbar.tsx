import Link from "next/link";
import { ModeToggle } from "./ToggleTheme";

export default function Navbar() {
  const loggedIn = true;
  return (
    <nav className="flex items-center justify-between p-6 bg-gray-800 text-white shadow-md">
      {/* Navbar Logo */}
      <div className="text-2xl font-bold">
        <Link href="/">Vi-Dash</Link>
      </div>

      {/* Navbar Links */}
      <div className="flex items-center gap-4 text-xl font-semibold">
        <Link href="/">Home</Link>
        <Link href="/pages/courses/allcourses">Courses</Link>
        <Link href="/pages/resources/allresource">Resources</Link>
        <Link href="/contact">Contact</Link>
      </div>

      {/* Navbar Authentication */}
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
    </nav>
  );
}
