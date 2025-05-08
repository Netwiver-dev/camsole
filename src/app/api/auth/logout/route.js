import { NextResponse } from "next/server";
import { cookieOptions } from "../../../lib/auth";

export async function POST(req) {
    try {
        // Clear the authentication cookie by expiring it
        const response = NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
        response.cookies.set("authToken", "", {...cookieOptions, maxAge: 0 });
        return response;
    } catch (error) {
        console.error("Logout error:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
        });
    }
}