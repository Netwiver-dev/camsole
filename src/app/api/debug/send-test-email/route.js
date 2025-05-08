import { NextResponse } from "next/server";

// This endpoint is no longer used as email verification has been removed
export async function GET() {
    return NextResponse.json({
        message: "Email verification functionality has been removed from the application",
    }, { status: 200 });
}