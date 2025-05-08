import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../lib/auth";

export async function GET() {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({
                error: "Not authenticated",
                authenticated: false,
            }, { status: 401 });
        }

        return NextResponse.json({
            ...user,
            authenticated: true,
        });
    } catch (error) {
        console.error("Error fetching current user:", error);
        return NextResponse.json({ error: "An error occurred", authenticated: false }, { status: 500 });
    }
}