import { NextRequest } from 'next/server';
import {supabase} from '@/lib/db'

export async function POST(req: NextRequest) {
  const { title, description, tags, pdfUrl } = await req.json();


  const { data, error } = await supabase
    .from('resources')
    .insert([{ title, description, tags, pdf_url: pdfUrl }]);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }

  return new Response(JSON.stringify({ message: 'Resource added successfully', data:data }), { status: 200 });
}
