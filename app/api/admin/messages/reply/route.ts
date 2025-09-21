import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const { id, reply_text, replied_by } = await req.json();
    if (!id || !reply_text) {
      return NextResponse.json({ error: "id and reply_text are required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("contact_messages")
      .update({ reply_text, replied_at: new Date().toISOString(), replied_by: replied_by || null })
      .eq("id", id)
      .select("id, reply_text, replied_at, replied_by")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, data });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 500 });
  }
}
