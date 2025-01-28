import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  const { title, description, tags, pdfUrl } = await req.json();

  // Create a Supabase client with the user's token
  const supabase = createClient(
    'https://rbwyllcbtgtflzovqdpr.supabase.co',
    `${process.env.NEXT_PUBLIC_SUPABASE_KEY}`
  );

  const { data, error } = await supabase
    .from('resources')
    .insert([{ title, description, tags, pdf_url: pdfUrl }]);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }

  return new Response(JSON.stringify({ message: 'Resource added successfully', data }), { status: 200 });
}
