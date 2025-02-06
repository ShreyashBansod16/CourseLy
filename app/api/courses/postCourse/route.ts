import { NextRequest, NextResponse } from "next/server";
import {supabase} from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, price, detailed_description, thumbnail_link, video_link, resource_link } = body;

    if (!title || !description || !price || !detailed_description || !thumbnail_link ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (title.length < 3 || description.length < 10 || detailed_description.length < 20) {
      return NextResponse.json({ error: "Validation failed for title/description" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('courses')
      .insert([
        {
          title,
          description,
          price,
          detailed_description,
          thumbnail_link,
          video_link,
          resource_link: resource_link || null
        }
      ])
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: "Course added successfully", data: data[0] }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}




// {
//     "title": "Learn TypeScript",
//     "description": "A comprehensive guide to TypeScript.",
//     "price": 199.99,
//     "detailed_description": "This course covers the fundamentals of TypeScript, including advanced concepts.",
//     "thumbnail_link": "https://example.com/thumbnail.jpg",
//     "video_link": "https://example.com/video.mp4",
//     "resource_link": "https://example.com/resources.pdf"
//   }