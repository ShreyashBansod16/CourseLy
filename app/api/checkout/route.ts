import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

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

    // 1) Get course price from DB
    const { data: course, error: courseErr } = await supabaseAdmin
      .from("courses")
      .select("price")
      .eq("id", course_id)
      .maybeSingle();
    if (courseErr || !course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const basePriceInCents = Math.round(Number(course.price) * 100);
    if (!Number.isFinite(basePriceInCents) || basePriceInCents <= 0) {
      return NextResponse.json({ error: "Invalid course price" }, { status: 400 });
    }

    // 2) Count paid purchases for this course to determine discount eligibility
    const { count, error: countErr } = await supabaseAdmin
      .from("purchases")
      .select("id", { count: "exact", head: true })
      .eq("course_id", course_id)
      .eq("status", "paid");
    if (countErr) {
      return NextResponse.json({ error: "Unable to determine discount eligibility" }, { status: 500 });
    }

    const isDiscountEligible = typeof count === "number" && count < 10;
    const finalPriceInCents = isDiscountEligible
      ? Math.max(0, Math.round(basePriceInCents * 0.9))
      : basePriceInCents;

    const successUrl = `${process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin}/courses/allcourses?paid=1&course_id=${encodeURIComponent(course_id)}&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin}/courses/allcourses?canceled=1`;

    const checkout = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: session.user.email,
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: title,
            },
            unit_amount: finalPriceInCents,
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        course_id,
        course_title: title,
        user_email: session.user.email,
        base_price_in_cents: String(basePriceInCents),
        final_price_in_cents: String(finalPriceInCents),
        discount_applied: String(isDiscountEligible),
      },
    });

    return NextResponse.json({ url: checkout.url });
  } catch (e: any) {
    console.error("Checkout error:", e);
    return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 500 });
  }
}
