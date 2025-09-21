import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Missing webhook secret" }, { status: 500 });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

  let event: Stripe.Event;
  const rawBody = await req.text();

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const course_id = session.metadata?.course_id as string | undefined;
      const user_email = session.metadata?.user_email as string | undefined;

      if (course_id && user_email) {
        await supabaseAdmin.from("purchases").insert({
          course_id,
          user_email,
          status: "paid",
          session_id: session.id,
        });
      }
    }
  } catch (e) {
    console.error("Webhook handler error:", e);
    // Respond 200 so Stripe doesn't retry infinitely if our DB is flaky.
  }

  return NextResponse.json({ received: true });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
