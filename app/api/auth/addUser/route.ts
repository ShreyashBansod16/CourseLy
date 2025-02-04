import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {supabase} from '@/lib/db'

export async function POST(req: NextRequest) {
    try {
        const { username, email, password } = await req.json();

        // Validate input
        if (!username || !email || !password) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const lowerCaseUsername = username.toLowerCase();
        const lowerCaseEmail = email.toLowerCase();

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        const { data, error } = await supabase
            .from("users")
            .insert([{ username: lowerCaseUsername, email: lowerCaseEmail, password: hashedPassword }])
            .select("id, username, email, isregistered, isadmin, created_at")
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: "User added successfully" }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: err }, { status: 500 });
    }
}
