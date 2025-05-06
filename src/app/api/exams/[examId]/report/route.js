import connectToDatabase from '@/app/lib/mongodb';
import { Exam, Result, User } from '@/app/lib/models';
import { authenticate, teacherAuth } from '@/app/lib/auth';
import { generateExamReportPDF } from '@/app/lib/pdf-generator';

export async function GET(req, { params }) {
    await connectToDatabase();

    const { examId } = params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const reportType = searchParams.get("type") || "individual"; // 'individual' or 'class'

    // Authentication check
    const authResult = await authenticate(req);
    if (!authResult.authenticated) {
        return new Response(JSON.stringify({ error: authResult.error }), { status: authResult.status });
    }

    // Verify that the exam exists
    const exam = await Exam.findById(examId);
    if (!exam) {
        return new Response(JSON.stringify({ error: "Exam not found" }), { status: 404 });
    }

    // For individual student report
    if (reportType === "individual" && userId) {
        // Students can only view their own reports
        if (authResult.user.role === "student" && authResult.user._id.toString() !== userId) {
            return new Response(JSON.stringify({ error: "You don't have permission to view this report" }), { status: 403 });
        }

        // Teachers can only view reports for exams they created
        if (authResult.user.role === "teacher" && exam.createdBy.toString() !== authResult.user._id.toString()) {
            return new Response(JSON.stringify({ error: "You don't have permission to view this report" }), { status: 403 });
        }

        // Get result
        const result = await Result.findOne({
            examId,
            userId,
            completed: true
        });

        if (!result) {
            return new Response(JSON.stringify({ error: "Result not found or exam not completed" }), { status: 404 });
        }

        // Get student info
        const student = await User.findById(userId);

        // Generate PDF
        const pdfBuffer = await generateResultPDF(result, exam, student);

        // Send PDF as response
        return new Response(pdfBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="exam-${examId}-result-${userId}.pdf"`
            }
        });
    }

    // For class report (only for teachers and admins)
    if (reportType === "class" && (authResult.user.role === "teacher" || authResult.user.role === "admin")) {
        // Teachers can only view reports for exams they created
        if (authResult.user.role === "teacher" && exam.createdBy.toString() !== authResult.user._id.toString()) {
            return new Response(JSON.stringify({ error: "You don't have permission to view this report" }), { status: 403 });
        }

        // Get class name if provided
        const className = searchParams.get("class");

        // Query to find results
        let query = {
            examId,
            completed: true
        };

        // If class is specified, get students in that class and filter by their IDs
        if (className) {
            const students = await User.find({ role: "student", class: className }).select("_id");
            const studentIds = students.map(s => s._id);
            query.userId = { $in: studentIds };
        }

        // Get results with student info
        const results = await Result.find(query).populate("userId", "name email class");

        if (results.length === 0) {
            return new Response(JSON.stringify({ error: "No results found for this exam" }), { status: 404 });
        }

        // Generate PDF
        const pdfBuffer = await generateExamReportPDF(exam, results);

        // Send PDF as response
        return new Response(pdfBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="exam-${examId}-class-report.pdf"`
            }
        });
    }

    return new Response(JSON.stringify({ error: "Invalid report type or insufficient permissions" }), { status: 400 });
}