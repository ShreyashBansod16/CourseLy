import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendPaymentConfirmationEmail } from "@/lib/email";

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
      const course_title = session.metadata?.course_title as string | undefined;
      const user_email = (session.customer_details?.email as string | undefined) || (session.metadata?.user_email as string | undefined);
      const userName = session.customer_details?.name || null;

      if (course_id && user_email) {
        await supabaseAdmin.from("purchases").insert({
          course_id,
          user_email,
          status: "paid",
          session_id: session.id,
        });

        // Try to enrich email with amount and receipt URL
        let amountInCents: number | null = null;
        let currency: string | null = null;
        let receiptUrl: string | null = null;

        try {
          if (session.payment_intent) {
            const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY as string);
            const pi = await stripeClient.paymentIntents.retrieve(
              session.payment_intent as string,
              { expand: ["charges.data"] }
            );
            amountInCents = typeof pi.amount_received === "number" ? pi.amount_received : (pi.amount ?? null);
            // @ts-ignore
            currency = (pi.currency as string) || null;
            // @ts-ignore
            const charge = pi.charges?.data?.[0];
            // @ts-ignore
            receiptUrl = (charge?.receipt_url as string) || null;
          } else {
            // Fallback from session if available
            // @ts-ignore amount_total exists on completed sessions
            amountInCents = (session.amount_total as number) ?? null;
            // @ts-ignore currency exists on session
            currency = (session.currency as string) ?? null;
          }
        } catch {}

        // Send confirmation email (best-effort)
        try {
          const result = await sendPaymentConfirmationEmail({
            to: user_email,
            userName,
            courseTitle: course_title || course_id || "Your Course",
            amountInCents,
            currency,
            receiptUrl,
          });
          console.log("[webhook] email send result:", result);
        } catch (e) {
          console.error("[webhook] email send error:", e);
        }
      }
    }
  } catch (e) {
    console.error("Webhook handler error:", e);
    // Respond 200 so Stripe doesn't retry infinitely if our DB is flaky.
  }

  return NextResponse.json({ received: true });
}

// Ensure Node.js runtime (Stripe SDK requires Node APIs) and no caching
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const config = {
  api: {
    bodyParser: false,
  },
};
