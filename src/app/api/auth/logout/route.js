import { clearAuthCookie } from '../../../lib/auth';

export async function POST(req) {
    try {
        // Clear the authentication cookie
        clearAuthCookie();

        return new Response(
            JSON.stringify({ message: 'Logged out successfully' }), { status: 200 }
        );
    } catch (error) {
        console.error('Logout error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }), { status: 500 }
        );
    }
}