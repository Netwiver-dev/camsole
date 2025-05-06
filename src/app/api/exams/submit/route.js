import db from "../../../../lib/mongodb";
import {
    Attempt,
    Result,
    Exam,
    Certificate,
    User,
} from "../../../../lib/models";
import { studentAuth } from "../../../../lib/auth";
import { sendExamResultEmail } from '@/app/lib/email';
import crypto from "crypto";

// Submit exam and calculate results
export async function POST(req) {
    await db;

    try {
        // Authenticate student
        const authResult = await studentAuth(req);

        if (!authResult.authenticated) {
            return new Response(JSON.stringify({ error: authResult.error }), {
                status: authResult.status,
            });
        }

        const userId = authResult.user._id;
        const { attemptId, isAutoSubmit } = await req.json();

        if (!attemptId) {
            return new Response(JSON.stringify({ error: "Attempt ID is required" }), {
                status: 400,
            });
        }

        // Find the attempt
        const attempt = await Attempt.findById(attemptId);

        if (!attempt) {
            return new Response(JSON.stringify({ error: "Attempt not found" }), {
                status: 404,
            });
        }

        // Verify attempt belongs to user
        if (attempt.userId.toString() !== userId.toString()) {
            return new Response(
                JSON.stringify({ error: "Unauthorized access to this attempt" }), { status: 403 }
            );
        }

        // Check if already completed
        if (attempt.completed) {
            return new Response(
                JSON.stringify({ error: "This exam has already been submitted" }), { status: 400 }
            );
        }

        // Get exam data
        const exam = await Exam.findById(attempt.examId);

        if (!exam) {
            return new Response(JSON.stringify({ error: "Exam not found" }), {
                status: 404,
            });
        }

        // Calculate score
        let score = 0;
        exam.questions.forEach((question, index) => {
            if (attempt.answers[index] === question.correctAnswer) {
                score++;
            }
        });

        // Calculate percentage
        const percentage = (score / exam.questions.length) * 100;

        // Create result
        const result = await Result.create({
            userId: attempt.userId,
            examId: attempt.examId,
            answers: attempt.answers,
            score,
            percentage,
            startTime: attempt.startTime,
            endTime: new Date(),
            submittedAutomatically: isAutoSubmit || false,
        });

        // Update attempt to completed
        await Attempt.findByIdAndUpdate(attemptId, {
            completed: true,
            endTime: new Date(),
            submittedAutomatically: isAutoSubmit || false,
        });

        // Get user details
        const user = await User.findById(userId);

        // Send result notification email (in background)
        sendExamResultEmail(user.email, user.name, result, exam).catch((err) =>
            console.error(`Failed to send result email to ${user.email}:`, err)
        );

        // Generate certificate if score is above passing score (60%)
        let certificate = null;
        if (percentage >= 60) {
            const certificateId = crypto.randomBytes(16).toString("hex");

            certificate = await Certificate.create({
                userId,
                examId: exam._id,
                resultId: result._id,
                certificateId,
                issueDate: new Date(),
            });
        }

        return new Response(
            JSON.stringify({
                message: "Exam submitted successfully",
                result,
                certificate: certificate ? {
                    certificateId: certificate.certificateId,
                    issueDate: certificate.issueDate,
                } : null,
            }), { status: 200 }
        );
    } catch (error) {
        console.error("Error submitting exam:", error);
        return new Response(JSON.stringify({ error: "Failed to submit exam" }), {
            status: 500,
        });
    }
}