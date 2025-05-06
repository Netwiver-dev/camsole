import db from '../../../lib/mongodb';
import { User } from '../../../lib/models';
import { generateToken, setAuthCookie } from '../../../lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    await db;

    try {
        const { email, password } = await req.json();

        // Basic validation
        if (!email || !password) {
            return new Response(
                JSON.stringify({ error: 'Email and password are required' }), { status: 400 }
            );
        }

        // Find user by email
        const user = await User.findOne({ email });

        // Check if user exists
        if (!user) {
            return new Response(
                JSON.stringify({ error: 'Invalid login credentials' }), { status: 401 }
            );
        }

        // Verify if account is verified
        if (!user.isVerified) {
            return new Response(
                JSON.stringify({ error: 'Please verify your email before logging in' }), { status: 403 }
            );
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return new Response(
                JSON.stringify({ error: 'Invalid login credentials' }), { status: 401 }
            );
        }

        // Generate token
        const token = generateToken(user);

        // Set token in cookie
        setAuthCookie(token);

        // Return user info (excluding password)
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            class: user.class
        };

        return new Response(
            JSON.stringify({
                message: 'Login successful',
                user: userResponse
            }), { status: 200 }
        );

    } catch (error) {
        console.error('Login error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }), { status: 500 }
        );
    }
}

// GET handler - check current authentication status
export async function GET(req) {
    // This is implemented through the /api/auth/me endpoint
    return new Response(
        JSON.stringify({ error: 'Use /api/auth/me endpoint for auth status checks' }), { status: 405 }
    );
}