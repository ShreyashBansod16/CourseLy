"use client";
import Link from "next/link";
import { useUser } from "./context/UserContext";

export default function Home() {
  const { userData, loading } = useUser();
  const isAdmin = userData?.isAdmin;
  console.log(userData);
  if (loading) return <div>Loading...</div>;

  return isAdmin ? (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="font-bold text-2xl">Hello Admin Welcome to Vi-Dash</h1>
      <div className="flex gap-4">
        <Link
          href="/pages/courses/addcourse"
          className="flex items-center gap-2 border text-blue-500 border-white rounded-md p-2"
        >
          Add Cource
        </Link>
        <Link
          href="/pages/resources/addresource"
          className="flex items-center gap-2 border text-blue-500 border-white rounded-md p-2"
        >
          Add Resource
        </Link>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-4">
      <h1 className="font-bold text-2xl">Hello User Welcome to Vi-Dash</h1>
    </div>
  );
}
