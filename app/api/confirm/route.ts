import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  try {
    const session_id = new URL(req.url).searchParams.get("session_id");
    if (!session_id) return NextResponse.json({ error: "session_id is required" }, { status: 400 });

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session?.metadata?.course_id || !session?.metadata?.user_email) {
      return NextResponse.json({ error: "Missing metadata on session" }, { status: 400 });
    }

    // Only proceed if paid
    if (session.payment_status !== "paid") {
      return NextResponse.json({ ok: false, reason: "not_paid" });
    }

    const { data, error } = await supabaseAdmin
      .from("purchases")
      .insert({
        course_id: session.metadata.course_id,
        user_email: session.metadata.user_email,
        status: "paid",
        session_id: session.id,
      })
      .select("id")
      .single();

    if (error && !error.message.includes("duplicate")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, id: data?.id || null });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 500 });
  }
}
