import { compare, hash } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import crypto from "crypto";
import { User } from "./models";
import db from "./mongodb";
import { SignJWT, jwtVerify } from "jose";
import { MongoClient, ObjectId } from "mongodb";

// Secret for JWT signing - should be in environment variable
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Set secure cookie options
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    path: "/",
};

/**
 * Hash a password
 * @param {string} password - The plain text password
 * @returns {Promise<string>} - The hashed password
 */
export async function hashPassword(password) {
    return await hash(password, 12);
}

/**
 * Compare a password with a hash
 * @param {string} password - The plain text password
 * @param {string} hashedPassword - The hashed password
 * @returns {Promise<boolean>} - Whether the password matches
 */
export async function verifyPassword(password, hashedPassword) {
    return await compare(password, hashedPassword);
}

/**
 * Generate a JWT token for a user
 * @param {Object} user - The user object
 * @returns {string} - The JWT token
 */
export function generateToken(user) {
    return sign({
            id: user._id,
            email: user.email,
            role: user.role,
        },
        JWT_SECRET, { expiresIn: "7d" }
    );
}

/**
 * Verify a JWT token using jsonwebtoken
 * @param {string} token - The JWT token
 * @returns {Object|null} - The decoded token or null if invalid
 */
export function verifyJwtToken(token) {
    try {
        return verify(token, JWT_SECRET);
    } catch (error) {
        console.error("Token verification failed:", error.message);
        return null;
    }
}

/**
 * Get the authentication token from the request
 * @param {Request} req - The request object
 * @returns {string|null} - The auth token or null
 */
export function getAuthToken(req) {
    try {
        // First try to get token from Authorization header
        const authHeader = req.headers.get("Authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
            return authHeader.split(" ")[1];
        }

        // If no header, try to get from cookies
        const cookieHeader = req.headers.get("cookie");
        if (cookieHeader) {
            const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
                const [key, value] = cookie.trim().split("=");
                acc[key] = value;
                return acc;
            }, {});

            return cookies["authToken"] || null;
        }

        return null;
    } catch (error) {
        console.error("Error getting auth token:", error);
        return null;
    }
}

/**
 * Get the current user from the request
 * @param {Request} req - The request object
 * @returns {Object|null} - The current user or null if not authenticated
 */
export async function getCurrentUserFromRequest(req) {
    try {
        const token = getAuthToken(req);
        if (!token) return null;

        const decoded = verifyJwtToken(token);
        if (!decoded) return null;

        // Connect to database
        await db;
        const user = await User.findById(decoded.id).select("-password");

        return user || null;
    } catch (error) {
        console.error("Get current user from request failed:", error.message);
        return null;
    }
}

/**
 * Authentication middleware function for API routes
 * @param {Request} req - The request object
 * @returns {Object} - Result with authenticated status and user if successful
 */
export async function authenticate(req) {
    try {
        const user = await getCurrentUserFromRequest(req);

        if (!user) {
            return {
                authenticated: false,
                error: "Unauthorized",
                status: 401,
            };
        }

        return {
            authenticated: true,
            user,
        };
    } catch (error) {
        console.error("Authentication error:", error);
        return {
            authenticated: false,
            error: "Authentication failed",
            status: 500,
        };
    }
}

/**
 * Generate a random verification token
 * @returns {string} Random token
 */
export function generateVerificationToken() {
    return crypto.randomBytes(32).toString("hex");
}

/**
 * Generate a random reset password token
 * @returns {string} Random token
 */
export function generateResetToken() {
    return crypto.randomBytes(32).toString("hex");
}

/**
 * Create and sign JWT token using jose
 * @param {Object} payload - Data to encode in the token
 * @returns {Promise<string>} Signed JWT
 */
export async function createToken(payload) {
    const secretKey = new TextEncoder().encode(JWT_SECRET);

    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(secretKey);
}

/**
 * Verify JWT token using jose
 * @param {string} token - JWT token to verify
 * @returns {Promise<Object|null>} Decoded payload or null
 */
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

/**
 * Set authentication cookie
 * @param {Object} userData - User data to store in token
 * @returns {Promise<string>} JWT token
 */
export async function setAuthCookie(userData) {
    // Create payload from user data
    const payload = {
        id: userData._id.toString(),
        email: userData.email,
        role: userData.role,
    };

    // Create token
    const token = await createToken(payload);

    // Set cookie
    cookies().set("authToken", token, cookieOptions);

    return token;
}

/**
 * Clear authentication cookie
 */
export function clearAuthCookie() {
    cookies().set("authToken", "", {
        ...cookieOptions,
        maxAge: 0,
    });
}

/**
 * Get current authenticated user
 * @returns {Promise<Object|null>} User data or null
 */
export async function getCurrentUser() {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("authToken");

    if (!authCookie || !authCookie.value) {
        return null;
    }

    try {
        const payload = await verifyToken(authCookie.value);
        if (!payload || !payload.id) {
            return null;
        }

        // Connect to database
        await db;
        const user = await User.findById(payload.id).select("-password");

        if (!user) {
            return null;
        }

        return user;
    } catch (error) {
        console.error("Error getting current user:", error);
        return null;
    }
}

/**
 * Authentication middleware for API routes
 * @returns {Promise<Object|null>} User data or null
 */
export async function authMiddleware() {
    return await getCurrentUser();
}

/**
 * Authentication middleware for teachers
 * @returns {Promise<Object|null>} User data or null if not teacher
 */
export async function teacherAuth() {
    const user = await getCurrentUser();
    if (!user || (user.role !== "teacher" && user.role !== "admin")) {
        return null;
    }
    return user;
}

/**
 * Authentication middleware for admins
 * @returns {Promise<Object|null>} User data or null if not admin
 */
export async function adminAuth() {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
        return null;
    }
    return user;
}