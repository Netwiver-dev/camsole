import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { getDb } from "./db"; // Updated import to use the function
import { ObjectId } from "mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "your-default-secret";

// Duration for the JWT token
const TOKEN_EXPIRY = "12h"; // 12 hours

// Set secure cookie options
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 12 * 60 * 60 * 1000, // 12 hours in milliseconds
    path: "/",
};

// Create and sign JWT
export async function createToken(payload) {
    const secretKey = new TextEncoder().encode(JWT_SECRET);

    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(TOKEN_EXPIRY)
        .sign(secretKey);
}

// Verify JWT
export async function verifyToken(token) {
    try {
        const secretKey = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secretKey);
        return payload;
    } catch (error) {
        console.error("Token verification failed:", error);
        return null;
    }
}

// Set auth cookie
export async function setAuthCookie(userData) {
    // Create token with user data
    const token = await createToken({
        id: userData._id.toString(),
        email: userData.email,
        role: userData.role,
    });

    // Set the cookie
    cookies().set("authToken", token, cookieOptions);

    return token;
}

// Clear auth cookie
export function clearAuthCookie() {
    cookies().set("authToken", "", {
        ...cookieOptions,
        maxAge: 0, // Expire immediately
    });
}

// Get current user from token
export async function getCurrentUser() {
    const authToken = cookies().get("authToken") ? .value;

    if (!authToken) {
        return null;
    }

    try {
        const tokenData = await verifyToken(authToken);

        if (!tokenData || !tokenData.id) {
            return null;
        }

        // Get database instance
        const db = await getDb();

        const user = await db
            .collection("users")
            .findOne({ _id: new ObjectId(tokenData.id) });

        if (!user) {
            return null;
        }

        // Don't return sensitive information
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    } catch (error) {
        console.error("Error getting current user:", error);
        return null;
    }
}

// Authentication middleware for API routes
export async function authMiddleware() {
    const user = await getCurrentUser();

    if (!user) {
        return null;
    }

    return user;
}

// Teacher authentication middleware
export async function teacherAuth() {
    const user = await authMiddleware();

    if (!user || user.role !== "teacher") {
        return null;
    }

    return user;
}

// Admin authentication middleware
export async function adminAuth() {
    const user = await authMiddleware();

    if (!user || user.role !== "admin") {
        return null;
    }

    return user;
}