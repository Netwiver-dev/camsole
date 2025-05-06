import db from "../../../lib/mongodb";
import { Result, Exam } from "../../../lib/models";
import { authenticate } from "../../../lib/auth";

export async function POST(req) {
	db;

	try {
		// Authenticate
		const authResult = await authenticate(req);

		if (!authResult.authenticated) {
			return new Response(JSON.stringify({ error: authResult.error }), {
				status: authResult.status,
			});
		}

		const resultData = await req.json();

		// Validate required fields
		if (
			!resultData.examId ||
			resultData.score === undefined ||
			resultData.percentage === undefined
		) {
			return new Response(
				JSON.stringify({ error: "examId, score, and percentage are required" }),
				{ status: 400 }
			);
		}

		// Create result
		const result = new Result({
			...resultData,
			userId: resultData.userId || authResult.user._id,
			createdAt: new Date(),
		});

		await result.save();

		return new Response(
			JSON.stringify({
				message: "Result created successfully",
				result,
			}),
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating result:", error);
		return new Response(JSON.stringify({ error: "Failed to create result" }), {
			status: 500,
		});
	}
}

export async function GET(req) {
	await db;

	try {
		// Authenticate user
		const authResult = await authenticate(req);

		if (!authResult.authenticated) {
			return new Response(JSON.stringify({ error: authResult.error }), {
				status: authResult.status,
			});
		}

		const userId = authResult.user._id;
		const { searchParams } = new URL(req.url);
		const examId = searchParams.get("examId");

		// If specific result is requested by exam
		if (examId) {
			let result;

			// If the user is a student, just get their result
			if (authResult.user.role === "student") {
				result = await Result.findOne({
					examId,
					userId,
				});
			}
			// If the user is a teacher, they can get any result for exams they created
			else if (authResult.user.role === "teacher") {
				// First check if exam was created by this teacher
				const exam = await Exam.findById(examId);
				if (!exam || !exam.createdBy.equals(userId)) {
					return new Response(
						JSON.stringify({ error: "Unauthorized access to this exam" }),
						{ status: 403 }
					);
				}

				// Get all results for this exam
				const results = await Result.find({ examId }).populate(
					"userId",
					"name email class"
				);

				return new Response(JSON.stringify(results), { status: 200 });
			}

			if (!result) {
				return new Response(JSON.stringify({ error: "Result not found" }), {
					status: 404,
				});
			}

			return new Response(JSON.stringify(result), { status: 200 });
		}

		// Otherwise get all results
		if (authResult.user.role === "student") {
			// For students, get all their results
			const results = await Result.find({ userId })
				.populate({
					path: "examId",
					select: "title date",
				})
				.sort({ createdAt: -1 });

			return new Response(JSON.stringify(results), { status: 200 });
		} else if (authResult.user.role === "teacher") {
			// For teachers, get results for exams they created
			const exams = await Exam.find({ createdBy: userId });
			const examIds = exams.map((exam) => exam._id);

			const results = await Result.find({ examId: { $in: examIds } })
				.populate("userId", "name email class")
				.populate("examId", "title date")
				.sort({ createdAt: -1 });

			return new Response(JSON.stringify(results), { status: 200 });
		}

		return new Response(JSON.stringify({ error: "Unauthorized role" }), {
			status: 403,
		});
	} catch (error) {
		console.error("Error fetching results:", error);
		return new Response(JSON.stringify({ error: "Failed to fetch results" }), {
			status: 500,
		});
	}
}
