import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const { id, is_read } = await req.json();
    if (!id || typeof is_read !== "boolean") {
      return NextResponse.json({ error: "id and is_read (boolean) are required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("contact_messages")
      .update({ is_read })
      .eq("id", id)
      .select("id, is_read")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, data });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 500 });
  }
}
