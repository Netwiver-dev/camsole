import db from "@/lib/mongodb";
import { User } from "@/lib/models";
import { NextResponse } from "next/server";

// For development only - allows auto-verifying a user account by email
export async function GET(req) {
    // Only allow in development mode
    if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "This endpoint is only available in development mode" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
        return NextResponse.json({ error: "Email parameter is required" }, { status: 400 });
    }

    try {
        await db;

        // Find the user
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Set the user as verified
        user.isVerified = true;
        await user.save();

        return NextResponse.json({
            success: true,
            message: `User ${email} has been verified`,
        });
    } catch (error) {
        console.error("Error auto-verifying user:", error);
        return NextResponse.json({ error: "Failed to auto-verify user", details: error.message }, { status: 500 });
    }
}