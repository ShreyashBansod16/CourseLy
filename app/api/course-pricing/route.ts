import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const course_id = searchParams.get("course_id");
    if (!course_id) {
      return NextResponse.json({ error: "course_id is required" }, { status: 400 });
    }

    // Get base price from DB (assumed in INR in a numeric column `price`)
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

    // Count paid purchases for discount availability
    const { count, error: countErr } = await supabaseAdmin
      .from("purchases")
      .select("id", { count: "exact", head: true })
      .eq("course_id", course_id)
      .eq("status", "paid");

    if (countErr) {
      return NextResponse.json({ error: "Unable to determine discount availability" }, { status: 500 });
    }

    const paidCount = typeof count === "number" ? count : 0;
    const quota = 10;
    const remainingDiscounted = Math.max(0, quota - paidCount);
    const isDiscountActive = remainingDiscounted > 0;

    const discountedPriceInCents = Math.max(0, Math.round(basePriceInCents * 0.9));

    return NextResponse.json({
      base_price_cents: basePriceInCents,
      discounted_price_cents: discountedPriceInCents,
      discount_quota: quota,
      remaining_discounted: remainingDiscounted,
      is_discount_active: isDiscountActive,
      currency: "INR",
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 500 });
  }
}
