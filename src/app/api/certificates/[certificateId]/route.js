import db from "../../../../lib/mongodb";
import { Certificate, Result, Exam, User } from "../../../../lib/models";

export async function GET(req, { params }) {
    await db;

    try {
        const certificateId = params.certificateId;

        if (!certificateId) {
            return new Response(
                JSON.stringify({ error: "Certificate ID is required" }), { status: 400 }
            );
        }

        // Find certificate by ID
        const certificate = await Certificate.findOne({ certificateId });

        if (!certificate) {
            return new Response(
                JSON.stringify({
                    verified: false,
                    error: "Certificate not found",
                }), { status: 404 }
            );
        }

        // Check if certificate is valid
        if (!certificate.verified) {
            return new Response(
                JSON.stringify({
                    verified: false,
                    error: "Certificate has been revoked",
                }), { status: 400 }
            );
        }

        // Get associated data
        const [result, exam, user] = await Promise.all([
            Result.findById(certificate.resultId),
            Exam.findById(certificate.examId),
            User.findById(certificate.userId),
        ]);

        // Don't expose sensitive user info
        const userData = user ? {
                name: user.name,
                class: user.class,
            } :
            null;

        return new Response(
            JSON.stringify({
                verified: true,
                certificate: {
                    certificateId,
                    issueDate: certificate.issueDate,
                    expiryDate: certificate.expiryDate,
                },
                exam: exam ? {
                    title: exam.title,
                    date: exam.date,
                } : null,
                result: result ? {
                    score: result.score,
                    percentage: result.percentage,
                    completedDate: result.createdAt,
                } : null,
                user: userData,
            }), { status: 200 }
        );
    } catch (error) {
        console.error("Error verifying certificate:", error);
        return new Response(
            JSON.stringify({
                verified: false,
                error: "Failed to verify certificate",
            }), { status: 500 }
        );
    }
}