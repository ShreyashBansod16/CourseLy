import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// GET: list approved reviews (optionally filter by course_id)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const course_id = searchParams.get("course_id");

    let query = supabaseAdmin
      .from("reviews")
      .select("id, course_id, user_name, rating, comment, created_at")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(50);

    if (course_id) {
      query = query.eq("course_id", course_id);
    }

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ reviews: data || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 500 });
  }
}

// POST: submit a new review (requires user_name, user_email server-side use; course_id optional)
export async function POST(req: NextRequest) {
  try {
    const { course_id, user_email, user_name, rating, comment } = await req.json();
    if (!user_email || !user_name || !rating || !comment) {
      return NextResponse.json({ error: "user_email, user_name, rating, comment are required" }, { status: 400 });
    }
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "rating must be 1-5" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("reviews")
      .insert([{ course_id: course_id || null, user_email, user_name, rating, comment, approved: true }])
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, id: data.id });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 500 });
  }
}
