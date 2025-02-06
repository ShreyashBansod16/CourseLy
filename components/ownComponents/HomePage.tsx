"use client";
import Link from "next/link";
import { useUser } from '../../app/context/UserContext';
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { userData, loading } = useUser();
  const isAdmin = userData?.isAdmin;
  console.log(userData);
  if (loading) return <div>Loading...</div>;

  return isAdmin ? (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="font-bold text-2xl">Hello Admin Welcome to CourseLy</h1>
      <div className="flex gap-4">
        <Link
          href="/pages/courses/addcourse"
          // className="font-mono font-bold text-4xl"
          // className="flex items-center gap-2 border text-blue-500 border-white rounded-md p-2"
        >
          <Button>Add Cource</Button>
        </Link>
        <Link
          href="/pages/resources/addresource"
          // className="font-mono font-bold text-2xl"
          // className="flex items-center gap-2 border text-blue-500 border-white rounded-md p-2"
        >
          <Button>Add Resource</Button>
        </Link>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-4">
      <h1 className="font-bold text-2xl">Hello User Welcome to CourseLy</h1>
    </div>
  );
}
