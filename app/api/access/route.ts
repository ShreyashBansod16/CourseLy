import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ hasAccess: false, reason: "unauthenticated" }, { status: 200 });
    }
    const { searchParams } = new URL(req.url);
    const course_id = searchParams.get("course_id");
    if (!course_id) {
      return NextResponse.json({ error: "course_id is required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("purchases")
      .select("id, status")
      .eq("user_email", session.user.email)
      .eq("course_id", course_id)
      .eq("status", "paid")
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ hasAccess: !!data });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 500 });
  }
}
