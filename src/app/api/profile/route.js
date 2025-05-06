import db from "../../../lib/mongodb";
import { User, Result, Exam } from "../../../lib/models";
import { authenticate } from "../../../lib/auth";
import bcrypt from "bcryptjs";

export async function GET(req) {
	await db;

	// Authentication check
	const authResult = await authenticate(req);
	if (!authResult.authenticated) {
		return new Response(JSON.stringify({ error: authResult.error }), {
			status: authResult.status,
		});
	}

	const user = authResult.user;

	// Get user's stats
	const stats = {
		totalExams: 0,
		completedExams: 0,
		averageScore: 0,
		pendingExams: 0,
	};

	// Get completed exams
	const completedResults = await Result.find({
		userId: user._id,
		completed: true,
	});

	stats.completedExams = completedResults.length;

	// Calculate average score
	if (completedResults.length > 0) {
		const totalScore = completedResults.reduce(
			(acc, result) => acc + (result.percentage || 0),
			0
		);
		stats.averageScore = Math.round(totalScore / completedResults.length);
	}

	// For students, get assigned exams
	if (user.role === "student") {
		const assignedExams = await Exam.find({
			assignedTo: user.class,
			status: "published",
		}).select("_id");

		stats.totalExams = assignedExams.length;
		stats.pendingExams = stats.totalExams - stats.completedExams;
	}

	// For teachers, get created exams
	if (user.role === "teacher") {
		const createdExams = await Exam.countDocuments({ createdBy: user._id });
		stats.totalExams = createdExams;
	}

	// Return user profile with stats
	const profile = {
		_id: user._id,
		name: user.name,
		email: user.email,
		role: user.role,
		class: user.class,
		stats,
	};

	return new Response(JSON.stringify(profile), { status: 200 });
}

export async function PUT(req) {
	await db;

	// Authentication check
	const authResult = await authenticate(req);
	if (!authResult.authenticated) {
		return new Response(JSON.stringify({ error: authResult.error }), {
			status: authResult.status,
		});
	}

	const { name, currentPassword, newPassword } = await req.json();
	const user = await User.findById(authResult.user._id);

	// Update name if provided
	if (name) {
		user.name = name;
	}

	// Update password if provided
	if (currentPassword && newPassword) {
		// Verify current password
		const isMatch = await bcrypt.compare(currentPassword, user.password);

		if (!isMatch) {
			return new Response(
				JSON.stringify({ error: "Current password is incorrect" }),
				{ status: 400 }
			);
		}

		// Hash new password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(newPassword, salt);
		user.password = hashedPassword;
	}

	await user.save();

	// Return updated user info (without password)
	const updatedUser = {
		_id: user._id,
		name: user.name,
		email: user.email,
		role: user.role,
		class: user.class,
	};

	return new Response(JSON.stringify(updatedUser), { status: 200 });
}
