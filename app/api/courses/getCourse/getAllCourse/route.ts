import { NextRequest, NextResponse } from "next/server";
import {supabase} from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('id, title, description, price, detailed_description, thumbnail_link, video_link, resource_link, created_at');

    if (error) {
      throw error;
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
