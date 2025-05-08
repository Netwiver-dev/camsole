import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "../../../lib/db";
import { createToken, cookieOptions } from "../../../lib/auth";

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        // Get database connection
        const db = await getDb();

        // Find user by email - convert to lowercase for case-insensitive comparison
        const user = await db.collection("users").findOne({
            email: email.toLowerCase(),
        });

        // Add debugging for troubleshooting
        console.log(`Login attempt for email: ${email}`);
        console.log(`User found: ${user ? "Yes" : "No"}`);

        // Check if user exists
        if (!user) {
            console.log("User not found");
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log(`Password valid: ${isPasswordValid ? "Yes" : "No"}`);

        if (!isPasswordValid) {
            console.log("Invalid password");
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        // Create and set authentication cookie
        const token = await createToken({
            id: user._id.toString(),
            email: user.email,
            role: user.role,
        });

        // Return user data (excluding password)
        const { password: _, ...userData } = user;

        // Log successful login
        console.log(`User ${user.email} (${user.role}) logged in successfully`);

        // Prepare response and attach cookie
        const response = NextResponse.json({ message: "Login successful", user: userData }, { status: 200 });
        response.cookies.set("authToken", token, cookieOptions);
        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "An error occurred during login" }, { status: 500 });
    }
}