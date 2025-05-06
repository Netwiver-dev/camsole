import db from "../../lib/mongodb";
import { User } from "../../lib/models";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "../../lib/email";

export async function POST(req) {
	await db;
	const { email, password, name, role, class: userClass } = await req.json();

	// Check if user already exists
	const existingUser = await User.findOne({ email });
	if (existingUser) {
		return new Response(JSON.stringify({ error: "Email already registered" }), {
			status: 400,
		});
	}

	// Generate verification token
	const verificationToken = crypto.randomBytes(32).toString("hex");
	const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

	// Hash password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	// Create new user
	const newUser = new User({
		email,
		password: hashedPassword,
		name,
		role,
		class: userClass, // Only applies for students
		verificationToken,
		verificationExpires,
	});

	await newUser.save();

	// Send verification email
	await sendVerificationEmail(email, verificationToken);

	// Return user info without sensitive data
	const userInfo = {
		_id: newUser._id,
		email: newUser.email,
		name: newUser.name,
		role: newUser.role,
		verified: newUser.verified,
	};

	return new Response(
		JSON.stringify({
			message:
				"User registered successfully. Please check your email to verify your account.",
			user: userInfo,
		}),
		{ status: 201 }
	);
}

export async function GET(req) {
	await db;

	// Get authenticated user from session (or other auth method)
	// This is a placeholder for now, replace with your actual auth mechanism
	const { searchParams } = new URL(req.url);
	const role = searchParams.get("role");

	// Basic permission check - in a real application, you'd check if the
	// requesting user has permissions to list users

	let query = {};
	if (role) {
		query.role = role;
	}

	const users = await User.find(query).select(
		"-password -verificationToken -verificationExpires -resetPasswordToken -resetPasswordExpires"
	);

	return new Response(JSON.stringify(users), { status: 200 });
}
