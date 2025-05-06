import db from '../../../lib/mongodb';
import { User } from '../../../lib/models';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    await db;

    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return new Response(
                JSON.stringify({ error: 'Token and password are required' }), { status: 400 }
            );
        }

        // Find user by reset token and check if token is still valid
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return new Response(
                JSON.stringify({ error: 'Invalid or expired reset token' }), { status: 400 }
            );
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update user's password and clear reset token fields
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return new Response(
            JSON.stringify({ message: 'Password has been reset successfully' }), { status: 200 }
        );

    } catch (error) {
        console.error('Password reset error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }), { status: 500 }
        );
    }
}

// GET endpoint to verify token before showing the reset form
export async function GET(req) {
    await db;

    try {
        // Get token from URL params
        const url = new URL(req.url);
        const token = url.searchParams.get('token');

        if (!token) {
            return new Response(
                JSON.stringify({ error: 'Reset token is required' }), { status: 400 }
            );
        }

        // Find user by reset token and check if token is still valid
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return new Response(
                JSON.stringify({ valid: false, error: 'Invalid or expired reset token' }), { status: 200 }
            );
        }

        return new Response(
            JSON.stringify({ valid: true }), { status: 200 }
        );

    } catch (error) {
        console.error('Token verification error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }), { status: 500 }
        );
    }
}