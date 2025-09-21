import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return new Response(JSON.stringify({ error: "Missing file" }), { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create a unique path in the bucket
    const time = Date.now();
    const safeName = (file.name || "upload.pdf").replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${time}_${safeName}`;

    // Ensure bucket exists (create if missing)
    const ensure = await supabaseAdmin.storage.createBucket("pdfs", { public: true });
    // Ignore error if bucket already exists
    if (ensure.error && !/exists/i.test(ensure.error.message)) {
      return new Response(JSON.stringify({ error: `Failed to ensure bucket: ${ensure.error.message}` }), { status: 400 });
    }

    const { data, error } = await supabaseAdmin.storage
      .from("pdfs")
      .upload(path, buffer, {
        cacheControl: "3600",
        contentType: file.type || "application/pdf",
        upsert: false,
      });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }

    const { data: publicUrlData } = supabaseAdmin.storage.from("pdfs").getPublicUrl(path);
    const publicUrl = publicUrlData.publicUrl;

    return new Response(JSON.stringify({ url: publicUrl, path }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Unexpected error" }), { status: 500 });
  }
}
