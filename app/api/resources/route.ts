import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  try {
    const { title, description, tags, pdfUrl } = await req.json();

    if (!title || !description || !pdfUrl) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('resources')
      .insert([{ title, description, tags, pdf_url: pdfUrl }])
      .select()
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }

    return new Response(JSON.stringify({ message: 'Resource added successfully', data }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'Unexpected error' }), { status: 500 });
  }
}