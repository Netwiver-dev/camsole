import db from "@/app/lib/mongodb";
import { Result, Certificate, User, Exam } from "@/app/lib/models";
import { authenticate, teacherAuth } from "@/app/lib/auth";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
    await db;

    try {
        // Check if the user is authenticated as a teacher
        const authResult = await teacherAuth(req);

        if (!authResult.authenticated) {
            return new Response(JSON.stringify({ error: authResult.error }), {
                status: authResult.status,
            });
        }

        const examId = params.examId;

        // Validate the examId
        if (!ObjectId.isValid(examId)) {
            return new Response(JSON.stringify({ error: "Invalid exam ID" }), {
                status: 400,
            });
        }

        // Get studentId from query parameters
        const url = new URL(req.url);
        const studentId = url.searchParams.get("studentId");

        // Validate studentId
        if (!studentId || !ObjectId.isValid(studentId)) {
            return new Response(
                JSON.stringify({ error: "Valid student ID is required" }), { status: 400 }
            );
        }

        // Get detailed exam information including questions
        const exam = await Exam.findById(examId);
        if (!exam) {
            return new Response(JSON.stringify({ error: "Exam not found" }), {
                status: 404,
            });
        }

        // Get student information
        const student = await User.findById(studentId).select("_id name email");
        if (!student) {
            return new Response(JSON.stringify({ error: "Student not found" }), {
                status: 404,
            });
        }

        // Find the latest result for this exam and student
        const result = await Result.findOne({
            examId: new ObjectId(examId),
            userId: new ObjectId(studentId),
        }).sort({ createdAt: -1 });

        if (!result) {
            return new Response(
                JSON.stringify({ error: "No result found for this student and exam" }), { status: 404 }
            );
        }

        // Check if a certificate exists for this result
        const certificate = await Certificate.findOne({ resultId: result._id });

        return new Response(
            JSON.stringify({
                ...result.toObject(),
                certificate: certificate ?
                    {
                        _id: certificate._id,
                        certificateId: certificate.certificateId,
                        createdAt: certificate.createdAt,
                    } :
                    null,
            }), { status: 200 }
        );
    } catch (error) {
        console.error(`Error fetching results for exam ${params.examId}:`, error);
        return new Response(JSON.stringify({ error: "Failed to fetch results" }), {
            status: 500,
        });
    }
}