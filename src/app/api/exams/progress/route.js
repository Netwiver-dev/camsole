import db from "../../../../lib/mongodb";
import { Attempt } from "../../../../lib/models";
import { studentAuth } from "../../../../lib/auth";

// Update exam progress
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
        const { attemptId, answers, flaggedQuestions, timeRemaining } =
        await req.json();

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
                JSON.stringify({ error: "Cannot update a completed attempt" }), { status: 400 }
            );
        }

        // Update fields
        const updateData = {};

        if (answers) {
            updateData.answers = answers;
        }

        if (flaggedQuestions) {
            updateData.flaggedQuestions = flaggedQuestions;
        }

        if (timeRemaining) {
            updateData.timeRemaining = timeRemaining;
        }

        // Update the attempt
        const updatedAttempt = await Attempt.findByIdAndUpdate(
            attemptId,
            updateData, { new: true }
        );

        return new Response(
            JSON.stringify({
                message: "Progress updated",
                attempt: updatedAttempt,
            }), { status: 200 }
        );
    } catch (error) {
        console.error("Error updating exam progress:", error);
        return new Response(
            JSON.stringify({ error: "Failed to update progress" }), { status: 500 }
        );
    }
}