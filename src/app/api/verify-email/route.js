import db from '../../../lib/mongodb';
import { User } from '../../../lib/models';

export async function GET(req) {
    await db;

    try {
        // Get token from URL params
        const url = new URL(req.url);
        const token = url.searchParams.get('token');

        if (!token) {
            return new Response(
                JSON.stringify({ error: 'Verification token is required' }), { status: 400 }
            );
        }

        // Find user with this token
        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return new Response(
                JSON.stringify({ error: 'Invalid or expired verification token' }), { status: 400 }
            );
        }

        // Update user as verified
        user.isVerified = true;
        user.verificationToken = undefined; // Clear the token
        await user.save();

        // Redirect to login page with success message
        return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login?verified=true`, 302);

    } catch (error) {
        console.error('Email verification error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }), { status: 500 }
        );
    }
}