import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.redirect(new URL("/user/login", process.env.NEXT_PUBLIC_BASE_URL));

  // Manually clear authentication cookie
  // response.cookies.set("next-auth.session-token", "", {
  //   path: "/",
  //   expires: new Date(0), // Expire immediately
  // });

  response.cookies.delete("next-auth.session-token");
  redirect("/user/login");

  // return response;
}
