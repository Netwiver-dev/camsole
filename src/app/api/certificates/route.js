import db from "../../../lib/mongodb";
import { Certificate, Exam, Result } from "../../../lib/models";
import { authenticate } from "../../../lib/auth";

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

        // Find all certificates for this user
        const certificates = await Certificate.find({ userId });

        // Populate exam and result details
        const certificatesWithDetails = await Promise.all(
            certificates.map(async(certificate) => {
                const [exam, result] = await Promise.all([
                    Exam.findById(certificate.examId),
                    Result.findById(certificate.resultId),
                ]);

                return {
                    ...certificate.toObject(),
                    exam: exam ? exam.toObject() : null,
                    result: result ? result.toObject() : null,
                };
            })
        );

        return new Response(JSON.stringify(certificatesWithDetails), {
            status: 200,
        });
    } catch (error) {
        console.error("Error fetching certificates:", error);
        return new Response(
            JSON.stringify({ error: "Failed to fetch certificates" }), { status: 500 }
        );
    }
}

export async function POST(req) {
    await db;

    try {
        const authResult = await teacherAuth(req);

        if (!authResult.authenticated) {
            return new Response(JSON.stringify({ error: authResult.error }), {
                status: authResult.status,
            });
        }

        const reqBody = await req.json();
        const { examId, userId, resultId } = reqBody;

        // Validate required fields
        if (!examId || !userId || !resultId) {
            return new Response(
                JSON.stringify({ error: "examId, userId, and resultId are required" }), { status: 400 }
            );
        }

        // Check if certificate already exists
        const existingCertificate = await Certificate.findOne({
            examId,
            userId,
            resultId,
        });

        if (existingCertificate) {
            return new Response(
                JSON.stringify({
                    message: "Certificate already exists",
                    certificate: existingCertificate,
                }), { status: 200 }
            );
        }

        // Verify the result exists and user passed the exam
        const result = await Result.findById(resultId);

        if (!result) {
            return new Response(JSON.stringify({ error: "Result not found" }), {
                status: 404,
            });
        }

        if (!result.passed) {
            return new Response(
                JSON.stringify({ error: "Cannot issue certificate for failed exam" }), { status: 400 }
            );
        }

        // Verify exam exists
        const exam = await Exam.findById(examId);

        if (!exam) {
            return new Response(JSON.stringify({ error: "Exam not found" }), {
                status: 404,
            });
        }

        // Verify user exists
        const user = await User.findById(userId);

        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 404,
            });
        }

        // Generate certificate ID (e.g., CERT-2023-12345)
        const certificateId = `CERT-${Date.now().toString().slice(-8)}`;

        // Create certificate
        const certificate = new Certificate({
            certificateId,
            examId,
            userId,
            resultId,
            issuerName: authResult.user.name,
            issuerId: authResult.user._id,
            issueDate: new Date(),
            organizationName: "Camsole Learning Center", // You might want to make this dynamic
            verified: true,
        });

        await certificate.save();

        return new Response(
            JSON.stringify({
                message: "Certificate issued successfully",
                certificate,
                certificateId,
            }), { status: 201 }
        );
    } catch (error) {
        console.error("Error issuing certificate:", error);
        return new Response(
            JSON.stringify({ error: "Failed to issue certificate" }), { status: 500 }
        );
    }
}