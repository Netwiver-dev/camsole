import db from "../../../../lib/mongodb";
import { authenticate } from "../../../../lib/auth";
import { Certificate, User, Exam, Result } from "../../../../lib/models";

export async function GET(req) {
    await db;

    try {
        // Authenticate user
        const authResult = await authenticate(req);

        if (!authResult.authenticated || authResult.user.role !== "teacher") {
            return new Response(
                JSON.stringify({ error: "Unauthorized. Teachers only." }), { status: 401 }
            );
        }

        // Get teacher ID
        const teacherId = authResult.user._id;

        // First, find all exams created by this teacher
        const exams = await Exam.find({ createdBy: teacherId });

        // Get the exam IDs
        const examIds = exams.map((exam) => exam._id);

        // Find certificates associated with those exams
        const certificates = await Certificate.find({ examId: { $in: examIds } });

        // Populate student, exam, and result details
        const populatedCertificates = await Promise.all(
            certificates.map(async(cert) => {
                const [student, exam, result] = await Promise.all([
                    User.findById(cert.userId),
                    Exam.findById(cert.examId),
                    Result.findById(cert.resultId),
                ]);

                return {
                    ...cert.toObject(),
                    student: student ? {
                        name: student.name,
                        email: student.email,
                        _id: student._id,
                    } : null,
                    exam: exam ? {
                        title: exam.title,
                        description: exam.description,
                        _id: exam._id,
                    } : null,
                    result: result ? {
                        score: result.score,
                        percentage: result.percentage,
                        _id: result._id,
                    } : null,
                };
            })
        );

        return new Response(JSON.stringify(populatedCertificates), { status: 200 });
    } catch (error) {
        console.error("Error fetching teacher certificates:", error);
        return new Response(
            JSON.stringify({ error: "Failed to fetch certificates" }), { status: 500 }
        );
    }
}