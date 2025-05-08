import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "../../../lib/db";
import { setAuthCookie } from "../../../lib/auth";

export async function POST(request) {
    try {
        const { name, email, password, role = "student" } = await request.json();

        // Validate input
        if (!name || !email || !password) {
            return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
        }

        // Get database connection
        const db = await getDb();

        // Check if email already exists
        const existingUser = await db.collection("users").findOne({
            email: email.toLowerCase(),
        });

        if (existingUser) {
            return NextResponse.json({ error: "Email is already in use" }, { status: 409 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = {
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role,
            createdAt: new Date(),
            // User is automatically verified
            isVerified: true,
        };

        // Insert user into database
        const result = await db.collection("users").insertOne(newUser);

        // Get the created user
        const user = await db
            .collection("users")
            .findOne({ _id: result.insertedId });

        // Set authentication cookie
        await setAuthCookie(user);

        // Return user data (excluding password)
        const { password: _, ...userData } = user;

        return NextResponse.json({
            message: "Signup successful",
            user: userData,
        }, { status: 201 });
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json({ error: "An error occurred during signup" }, { status: 500 });
    }
}