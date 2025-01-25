import Link from "next/link";

export default function Home() {
  const isAdmin = true;

  return isAdmin ? (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="font-bold text-2xl">Hello Admin Welcome to Vi-Dash</h1>
      <div className="flex gap-4">
        <Link
          href="/courses/addcourse"
          className="flex items-center gap-2 border text-blue-500 border-white rounded-md p-2"
        >
          Add Cource
        </Link>
        <Link
          href="/resources/addresource"
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
