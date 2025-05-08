import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        message: "Email verification has been removed from the application",
    });
}

export async function POST() {
    return NextResponse.json({
        message: "Email verification has been removed from the application",
    });
}