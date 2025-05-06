import db from "../../../lib/mongodb";
import { Exam, Attempt, Result, User } from "../../../lib/models";
import { authenticate, teacherAuth, studentAuth } from "../../../lib/auth";

export async function POST(req) {
    await db;
    
    try {
        // Check if the user is authenticated as a teacher
        const authResult = await teacherAuth(req);
        
        if (!authResult.authenticated) {
            return new Response(
                JSON.stringify({ error: authResult.error }),
                { status: authResult.status }
            );
        }
        
        const examData = await req.json();
        
        // Validate exam data
        if (!examData.title || !examData.date || !examData.duration) {
            return new Response(
                JSON.stringify({ error: 'Title, date and duration are required' }),
                { status: 400 }
            );
        }
        
        if (!examData.questions || examData.questions.length === 0) {
            return new Response(
                JSON.stringify({ error: 'At least one question is required' }),
                { status: 400 }
            );
        }
        
        // Create new exam
        const newExam = new Exam({
            ...examData,
            createdBy: authResult.user._id,
            status: examData.status || 'draft',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        await newExam.save();
        
        return new Response(
            JSON.stringify({ 
                message: 'Exam created successfully', 
                exam: newExam 
            }),
            { status: 201 }
        );
        
    } catch (error) {
        console.error('Error creating exam:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to create exam' }),
            { status: 500 }
        );
    }
}

export async function GET(req) {
    await db;
    
    try {
        // Check authentication
        const authResult = await authenticate(req);
        
        if (!authResult.authenticated) {
            return new Response(
                JSON.stringify({ error: authResult.error }),
                { status: authResult.status }
            );
        }

        const { searchParams } = new URL(req.url);
        const examId = searchParams.get("examId");
        
        // Get specific exam
        if (examId) {
            const exam = await Exam.findById(examId);
            
            if (!exam) {
                return new Response(
                    JSON.stringify({ error: "Exam not found" }), 
                    { status: 404 }
                );
            }
            
            // Check if teacher is the creator or student is in assigned class
            if (authResult.user.role === 'teacher') {
                if (!exam.createdBy.equals(authResult.user._id)) {
                    return new Response(
                        JSON.stringify({ error: "Unauthorized access to this exam" }), 
                        { status: 403 }
                    );
                }
            } else if (authResult.user.role === 'student') {
                if (!exam.assignedTo.includes(authResult.user.class) || exam.status !== 'published') {
                    return new Response(
                        JSON.stringify({ error: "Unauthorized access to this exam" }), 
                        { status: 403 }
                    );
                }
            }
            
            return new Response(
                JSON.stringify(exam), 
                { status: 200 }
            );
        }
        
        // Return exams based on role
        if (authResult.user.role === 'teacher') {
            const exams = await Exam.find({ createdBy: authResult.user._id })
                .sort({ createdAt: -1 });
                
            return new Response(JSON.stringify(exams), { status: 200 });
            
        } else if (authResult.user.role === 'student') {
            // For students, get exams assigned to their class
            const exams = await Exam.find({
                status: 'published',
                assignedTo: authResult.user.class
            }).sort({ date: 1 });
            
            // Get attempts and results for these exams
            const userId = authResult.user._id;
            const examResults = await Promise.all(exams.map(async (exam) => {
                // Check for attempt
                const attempt = await Attempt.findOne({
                    userId,
                    examId: exam._id
                });
                
                // Check for result
                const result = await Result.findOne({
                    userId,
                    examId: exam._id
                });
                
                return {
                    _id: exam._id,
                    title: exam.title,
                    description: exam.description,
                    date: exam.date,
                    duration: exam.duration,
                    status: result?.completed ? 'completed' : (attempt ? 'in-progress' : 'upcoming'),
                    questions: exam.questions.length,
                    result: result ? {
                        _id: result._id,
                        score: result.score,
                        percentage: result.percentage,
                        completed: result.completed
                    } : null,
                    attempt: attempt ? {
                        _id: attempt._id,
                        timeRemaining: attempt.timeRemaining,
                        completed: attempt.completed
                    } : null
                };
            }));
            
            return new Response(JSON.stringify(examResults), { status: 200 });
        }
        
        return new Response(
            JSON.stringify({ error: "Unauthorized role" }), 
            { status: 403 }
        );
        
    } catch (error) {
        console.error('Error getting exams:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to fetch exams' }),
            { status: 500 }
        );
    }
}
