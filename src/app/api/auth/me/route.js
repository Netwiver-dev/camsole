import { NextResponse } from 'next/server';
import { getAuthToken, verifyToken } from '@/app/lib/auth';

export async function GET(request) {
    try {
        // Wait for the token to be retrieved
        const token = await getAuthToken(request);

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
        }

        const decodedToken = await verifyToken(token);

        if (!decodedToken) {
            return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
        }

        // Return user data from decoded token
        return NextResponse.json({
            user: {
                id: decodedToken.userId,
                email: decodedToken.email,
                role: decodedToken.role,
                name: decodedToken.name,
                class: decodedToken.class
            }
        });
    } catch (error) {
        console.error('Auth error:', error);
        return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }
}