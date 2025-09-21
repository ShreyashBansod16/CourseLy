"use client";
import Link from "next/link";
import { useUser } from '../../app/context/UserContext';
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { userData, loading } = useUser();
  const isAdmin = userData?.isAdmin;
  
  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-pulse text-gray-600">Loading...</div>
    </div>
  );

  return isAdmin ? (
    <div className="flex flex-col items-center justify-center h-screen gap-8 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome Admin <span className="text-primary">👋</span>
        </h1>
        <p className="text-gray-600">Manage your CourseLy content</p>
      </div>
      <div className="flex gap-4">
        <Link href="/courses/addcourse">
          <Button className="px-8 py-4 text-lg shadow-md hover:shadow-lg transition-shadow">
            Add Course
          </Button>
        </Link>
        <Link href="/resources/addresource">
          <Button className="px-8 py-4 text-lg shadow-md hover:shadow-lg transition-shadow">
            Add Resource
          </Button>
        </Link>
        <Link href="/admin/messages">
          <Button variant="outline" className="px-8 py-4 text-lg shadow-sm hover:shadow-md transition-shadow">
            View Messages
          </Button>
        </Link>
      </div>
    </div>
  ) : (<></>);
}