import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { course_id, title } = await req.json();
    if (!course_id || !title) {
      return NextResponse.json({ error: "course_id and title are required" }, { status: 400 });
    }

    const successUrl = `${process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin}/courses/allcourses?paid=1&course_id=${encodeURIComponent(course_id)}&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin}/courses/allcourses?canceled=1`;

    const checkout = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: title,
            },
            unit_amount: 49900, // 499 INR in paise
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        course_id,
        user_email: session.user.email,
      },
    });

    return NextResponse.json({ url: checkout.url });
  } catch (e: any) {
    console.error("Checkout error:", e);
    return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 500 });
  }
}
