import { compare, hash } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { User } from './models';
import db from './mongodb';

// Secret for JWT signing - should be in environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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
        JWT_SECRET, { expiresIn: '7d' }
    );
}

/**
 * Verify a JWT token
 * @param {string} token - The JWT token
 * @returns {Object|null} - The decoded token or null if invalid
 */
export function verifyToken(token) {
    try {
        return verify(token, JWT_SECRET);
    } catch (error) {
        console.error('Token verification failed:', error.message);
        return null;
    }
}

/**
 * Get the current user from the request
 * @param {Request} req - The request object
 * @returns {Object|null} - The current user or null if not authenticated
 */
export function getCurrentUser(req) {
    try {
        // Get the Authorization header
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }

        // Extract and verify the token
        const token = authHeader.split(' ')[1];
        return verifyToken(token);
    } catch (error) {
        console.error('Get current user failed:', error.message);
        return null;
    }
}

/**
 * Set an authentication cookie
 * @param {string} token - The JWT token
 */
export function setAuthCookie(token) {
    cookies().set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
    });
}

/**
 * Clear the authentication cookie
 */
export function clearAuthCookie() {
    cookies().delete('auth-token');
}

/**
 * Authentication middleware for API routes
 * This can be used to protect API routes that require authentication
 * 
 * @param {Request} req - The incoming request
 * @param {Array} allowedRoles - Optional array of roles allowed to access the route
 * @returns {Object} { authenticated: boolean, user: User, error: string, status: number }
 */
export async function authenticate(req, allowedRoles = []) {
    await db;

    // Get token from cookie or authorization header
    const cookieStore = cookies();
    let token;

    // Try to get token from cookies first
    if (cookieStore) {
        token = cookieStore.get('token') ? .value;
    }

    // If not in cookies, check authorization header
    if (!token) {
        const authHeader = req.headers.get('authorization');
        token = authHeader ? .startsWith('Bearer ') ? authHeader.substring(7) : null;
    }

    if (!token) {
        return {
            authenticated: false,
            error: 'Authentication required',
            status: 401
        };
    }

    try {
        // Verify the token
        const decoded = verify(token, JWT_SECRET);

        // Check if token is expired
        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
            return {
                authenticated: false,
                error: 'Token expired',
                status: 401
            };
        }

        // Get user info
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return {
                authenticated: false,
                error: 'User not found',
                status: 401
            };
        }

        // Check if user is verified
        if (!user.isVerified) {
            return {
                authenticated: false,
                error: 'Email not verified',
                status: 403
            };
        }

        // Check role if specified
        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
            return {
                authenticated: false,
                error: 'Unauthorized access',
                status: 403
            };
        }

        return {
            authenticated: true,
            user,
            status: 200
        };
    } catch (error) {
        console.error('Authentication error:', error);
        return {
            authenticated: false,
            error: 'Invalid token',
            status: 401
        };
    }
}

/**
 * Middleware to check if user has teacher role
 * 
 * @param {Request} req - Request object
 * @returns {Object} Authentication result
 */
export async function teacherAuth(req) {
    return authenticate(req, ['teacher']);
}

/**
 * Middleware to check if user has student role
 * 
 * @param {Request} req - Request object
 * @returns {Object} Authentication result
 */
export async function studentAuth(req) {
    return authenticate(req, ['student']);
}

/**
 * Generate a verification token for email verification
 * @returns {string} - A random verification token
 */
export function generateVerificationToken() {
    return crypto.randomBytes(32).toString('hex');
}