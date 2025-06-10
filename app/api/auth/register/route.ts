import { createServerSupabaseClient } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();
    const supabase = await createServerSupabaseClient();

    // 1. Register ke Supabase Auth
    const {
      data: { user },
      error: signUpError,
    } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      return NextResponse.json({ error: signUpError.message }, { status: 400 });
    }

    // 2. Insert ke tabel public.users
    if (user) {
      const { error: profileError } = await supabase.from("users").insert([{ id: user.id, email, name, role: "user" }]);

      if (profileError) {
        console.error("Insert error:", profileError); // Tambahkan log error ini
        return NextResponse.json({ error: profileError.message }, { status: 400 });
      }
    }

    return NextResponse.json({ message: "Registration successful" });
  } catch (error) {
    console.error("Catch error:", error); // Log error global
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
