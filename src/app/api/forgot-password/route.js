import db from "../../../lib/mongodb";
import { User } from "../../../lib/models";
import { generateVerificationToken } from "../../../lib/auth";
import { sendPasswordResetEmail } from "../../../lib/email";
import crypto from "crypto";

export async function POST(req) {
	await db;

	try {
		const { email } = await req.json();

		if (!email) {
			return new Response(JSON.stringify({ error: "Email is required" }), {
				status: 400,
			});
		}

		// Find user by email
		const user = await User.findOne({ email });

		// For security, don't reveal if user exists or not
		if (!user) {
			return new Response(
				JSON.stringify({
					message:
						"If your email is registered, you will receive a password reset link",
				}),
				{ status: 200 }
			);
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(32).toString("hex");

		// Save token and expiry to user
		user.resetPasswordToken = resetToken;
		user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
		await user.save();

		// Send password reset email
		await sendPasswordResetEmail(user.email, resetToken, user.name);

		return new Response(
			JSON.stringify({
				message:
					"If your email is registered, you will receive a password reset link",
			}),
			{ status: 200 }
		);
	} catch (error) {
		console.error("Forgot password error:", error);
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
		});
	}
}
