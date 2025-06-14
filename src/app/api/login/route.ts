import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const hardcodeUsername = process.env.NEXT_PUBLIC_TEST_USERNAME || "susi";
const hardcodePassword = process.env.NEXT_PUBLIC_TEST_PASSWORD || "passwordnya1;

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (username === hardcodeUsername && password === hardcodePassword) {
    cookies().set("session_user", username, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24, // expiredIn 24h
      sameSite: "lax",
      secure: false,
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
}
