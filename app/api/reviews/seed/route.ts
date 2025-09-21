import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// Simple seeding endpoint to insert 5 random reviews.
// IMPORTANT: Remove or protect this endpoint after seeding.
export async function POST(req: NextRequest) {
  try {
    const samples = [
      {
        user_name: "Aarav Patel",
        user_email: "aarav@example.com",
        rating: 5,
        comment: "Amazing content and very clear explanations. Highly recommend!",
      },
      {
        user_name: "Diya Kapoor",
        user_email: "diya@example.com",
        rating: 4,
        comment: "Great pace and practical projects. Learned a lot!",
      },
      {
        user_name: "Kabir Singh",
        user_email: "kabir@example.com",
        rating: 5,
        comment: "Loved the UI and the overall learning experience.",
      },
      {
        user_name: "Ishaan Verma",
        user_email: "ishaan@example.com",
        rating: 5,
        comment: "Helped me land an internship—thank you!",
      },
      {
        user_name: "Meera Rao",
        user_email: "meera@example.com",
        rating: 4,
        comment: "Well structured curriculum and supportive community.",
      },
    ].map((r) => ({ ...r, course_id: null, approved: true }));

    const { error } = await supabaseAdmin.from("reviews").insert(samples);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ ok: true, inserted: samples.length });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 500 });
  }
}
