import { Exam, Attempt, Result, User, Certificate } from './models';
import { sendExamAssignmentEmail, sendExamResultEmail } from './email';
import { generateResultPdf, generateCertificatePdf } from './pdf-generator';
import crypto from 'crypto';

/**
 * Create a new exam
 * 
 * @param {Object} examData - Exam data to create
 * @param {String} userId - Teacher ID creating the exam
 * @returns {Promise<Object>} Created exam
 */
export async function createExam(examData, userId) {
    try {
        // Calculate total marks (1 mark per question)
        const totalMarks = examData.questions.length;

        // Create the exam
        const exam = await Exam.create({
            ...examData,
            totalMarks,
            createdBy: userId
        });

        return exam;
    } catch (error) {
        console.error('Error creating exam:', error);
        throw error;
    }
}

/**
 * Assign exam to classes and notify students
 * 
 * @param {String} examId - Exam ID
 * @param {Array} classNames - Array of class names
 * @returns {Promise<Object>} Updated exam
 */
export async function assignExamToClasses(examId, classNames) {
    try {
        // Update exam with assigned classes
        const exam = await Exam.findByIdAndUpdate(
            examId,
            { assignedTo: classNames, status: 'published' },
            { new: true }
        );

        // Find all students in these classes
        const students = await User.find({
            role: 'student',
            class: { $in: classNames }
        });

        // Notify each student via email (in background)
        students.forEach(student => {
            sendExamAssignmentEmail(student.email, student.name, exam)
                .catch(err => console.error(`Failed to send notification to ${student.email}:`, err));
        });

        return exam;
    } catch (error) {
        console.error('Error assigning exam:', error);
        throw error;
    }
}

/**
 * Start an exam attempt for a student
 * 
 * @param {String} examId - Exam ID
 * @param {String} userId - Student ID
 * @returns {Promise<Object>} Attempt data
 */
export async function startExam(examId, userId) {
    try {
        // Check if exam exists and is published
        const exam = await Exam.findOne({ _id: examId, status: 'published' });
        if (!exam) {
            throw new Error('Exam not found or not published');
        }

        // Check if student is in an assigned class
        const student = await User.findById(userId);
        if (!student || !exam.assignedTo.includes(student.class)) {
            throw new Error('You are not authorized to take this exam');
        }

        // Check if student has a completed result already
        const existingResult = await Result.findOne({
            userId,
            examId,
            completed: true
        });

        if (existingResult) {
            throw new Error('You have already completed this exam');
        }

        // Check for an existing attempt
        let attempt = await Attempt.findOne({ userId, examId });

        if (!attempt) {
            // Parse duration (HH:MM) to calculate timeRemaining
            const [hours, minutes] = exam.duration.split(':').map(Number);
            const durationMinutes = (hours * 60) + minutes;
            
            // Create new attempt
            attempt = await Attempt.create({
                userId,
                examId,
                startTime: new Date(),
                timeRemaining: exam.duration, // Store original duration initially
                answers: new Array(exam.questions.length).fill(null),
                flaggedQuestions: []
            });
        }

        return {
            attempt,
            exam: {
                _id: exam._id,
                title: exam.title,
                duration: exam.duration,
                questions: exam.questions
            }
        };
    } catch (error) {
        console.error('Error starting exam:', error);
        throw error;
    }
}

/**
 * Update exam progress
 * 
 * @param {String} attemptId - Attempt ID
 * @param {Object} updateData - Data to update (answers, flaggedQuestions, timeRemaining)
 * @returns {Promise<Object>} Updated attempt
 */
export async function updateExamProgress(attemptId, updateData) {
    try {
        const attempt = await Attempt.findByIdAndUpdate(
            attemptId,
            { $set: updateData },
            { new: true }
        );
        return attempt;
    } catch (error) {
        console.error('Error updating exam progress:', error);
        throw error;
    }
}

/**
 * Submit exam and calculate results
 * 
 * @param {String} attemptId - Attempt ID
 * @param {Boolean} isAutoSubmit - Whether it's an automatic submission (timeout)
 * @returns {Promise<Object>} Result object
 */
export async function submitExam(attemptId, isAutoSubmit = false) {
    try {
        // Get attempt data
        const attempt = await Attempt.findById(attemptId);
        if (!attempt) {
            throw new Error('Attempt not found');
        }

        if (attempt.completed) {
            throw new Error('This exam has already been submitted');
        }

        // Get exam data
        const exam = await Exam.findById(attempt.examId);
        if (!exam) {
            throw new Error('Exam not found');
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
            submittedAutomatically: isAutoSubmit
        });

        // Update attempt to completed
        await Attempt.findByIdAndUpdate(attemptId, {
            completed: true,
            endTime: new Date(),
            submittedAutomatically: isAutoSubmit
        });

        // Get user details
        const user = await User.findById(attempt.userId);

        // Send result notification email (in background)
        sendExamResultEmail(user.email, user.name, result, exam)
            .catch(err => console.error(`Failed to send result email to ${user.email}:`, err));

        // Generate certificate if score is above passing score (60%)
        if (percentage >= 60) {
            const certificateId = crypto.randomBytes(16).toString('hex');
            
            await Certificate.create({
                userId: user._id,
                examId: exam._id,
                resultId: result._id,
                certificateId,
                issueDate: new Date()
            });
        }

        return {
            result,
            exam
        };
    } catch (error) {
        console.error('Error submitting exam:', error);
        throw error;
    }
}

/**
 * Get result with exam details
 * 
 * @param {String} resultId - Result ID
 * @param {String} userId - User ID to verify ownership
 * @returns {Promise<Object>} Result with exam details
 */
export async function getExamResult(resultId, userId) {
    try {
        // Get result data
        const result = await Result.findById(resultId);
        
        if (!result) {
            throw new Error('Result not found');
        }

        // Verify ownership
        if (result.userId.toString() !== userId.toString()) {
            throw new Error('Unauthorized access to result');
        }

        // Get exam data
        const exam = await Exam.findById(result.examId);
        if (!exam) {
            throw new Error('Exam not found');
        }

        // Check for certificate
        const certificate = await Certificate.findOne({
            userId,
            examId: result.examId
        });

        return {
            result,
            exam,
            certificate: certificate ? {
                certificateId: certificate.certificateId,
                issueDate: certificate.issueDate
            } : null
        };
    } catch (error) {
        console.error('Error getting exam result:', error);
        throw error;
    }
}

/**
 * Generate result PDF
 * 
 * @param {String} resultId - Result ID
 * @param {String} userId - User ID to verify ownership
 * @returns {Promise<Buffer>} PDF buffer
 */
export async function generateResultPdfForUser(resultId, userId) {
    try {
        const { result, exam } = await getExamResult(resultId, userId);
        const user = await User.findById(userId);
        
        return await generateResultPdf(result, exam, user);
    } catch (error) {
        console.error('Error generating result PDF:', error);
        throw error;
    }
}

/**
 * Generate certificate PDF
 * 
 * @param {String} certificateId - Certificate ID
 * @returns {Promise<Buffer>} PDF buffer
 */
export async function generateCertificatePdfById(certificateId) {
    try {
        // Find certificate
        const certificate = await Certificate.findOne({ certificateId });
        if (!certificate) {
            throw new Error('Certificate not found');
        }

        // Get related data
        const result = await Result.findById(certificate.resultId);
        const exam = await Exam.findById(certificate.examId);
        const user = await User.findById(certificate.userId);

        return await generateCertificatePdf(certificate, result, exam, user);
    } catch (error) {
        console.error('Error generating certificate PDF:', error);
        throw error;
    }
}

/**
 * Get all exams for a student
 * 
 * @param {String} userId - Student ID
 * @returns {Promise<Array>} Array of exams with attempt/result status
 */
export async function getStudentExams(userId) {
    try {
        // Get student class
        const student = await User.findById(userId);
        if (!student) {
            throw new Error('Student not found');
        }

        // Get all published exams assigned to student's class
        const exams = await Exam.find({
            status: 'published',
            assignedTo: student.class
        }).sort({ date: 1 });

        // Get attempts and results for these exams
        const examResults = await Promise.all(exams.map(async exam => {
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
                questions: exam.questions,
                status: result?.completed ? 'completed' : (attempt ? 'in-progress' : 'upcoming'),
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

        return examResults;
    } catch (error) {
        console.error('Error getting student exams:', error);
        throw error;
    }
}

/**
 * Get all exams created by a teacher
 * 
 * @param {String} teacherId - Teacher ID
 * @returns {Promise<Array>} Array of exams with statistics
 */
export async function getTeacherExams(teacherId) {
    try {
        // Get all exams created by the teacher
        const exams = await Exam.find({
            createdBy: teacherId
        }).sort({ createdAt: -1 });

        // Add statistics to each exam
        const examResults = await Promise.all(exams.map(async exam => {
            // Get total attempts
            const attemptCount = await Attempt.countDocuments({
                examId: exam._id,
                completed: true
            });

            // Get completed results
            const results = await Result.find({
                examId: exam._id
            });

            // Calculate average score
            let averageScore = 0;
            if (results.length > 0) {
                const totalScore = results.reduce((sum, result) => sum + result.percentage, 0);
                averageScore = totalScore / results.length;
            }

            // Calculate passing rate
            const passedCount = results.filter(result => result.percentage >= 60).length;
            const passRate = results.length > 0 ? (passedCount / results.length) * 100 : 0;

            return {
                _id: exam._id,
                title: exam.title,
                description: exam.description,
                date: exam.date,
                duration: exam.duration,
                status: exam.status,
                assignedTo: exam.assignedTo,
                totalQuestions: exam.questions.length,
                statistics: {
                    attemptCount,
                    resultsCount: results.length,
                    averageScore,
                    passRate
                }
            };
        }));

        return examResults;
    } catch (error) {
        console.error('Error getting teacher exams:', error);
        throw error;
    }
}

/**
 * Get detailed exam results for a teacher
 * 
 * @param {String} examId - Exam ID
 * @param {String} teacherId - Teacher ID to verify ownership
 * @returns {Promise<Object>} Exam with detailed results
 */
export async function getExamResultsForTeacher(examId, teacherId) {
    try {
        // Get exam and verify teacher is creator
        const exam = await Exam.findById(examId);
        if (!exam) {
            throw new Error('Exam not found');
        }

        if (exam.createdBy.toString() !== teacherId.toString()) {
            throw new Error('Unauthorized access to exam results');
        }

        // Get all results for this exam
        const results = await Result.find({ examId });

        // Get student details for each result
        const detailedResults = await Promise.all(
            results.map(async result => {
                const student = await User.findById(result.userId);
                return {
                    _id: result._id,
                    student: {
                        _id: student._id,
                        name: student.name,
                        email: student.email,
                        class: student.class
                    },
                    score: result.score,
                    percentage: result.percentage,
                    startTime: result.startTime,
                    endTime: result.endTime,
                    submittedAutomatically: result.submittedAutomatically
                };
            })
        );

        // Group results by class
        const resultsByClass = {};
        detailedResults.forEach(result => {
            const className = result.student.class;
            if (!resultsByClass[className]) {
                resultsByClass[className] = [];
            }
            resultsByClass[className].push(result);
        });

        // Calculate statistics
        const totalStudents = detailedResults.length;
        const passedStudents = detailedResults.filter(r => r.percentage >= 60).length;
        const passRate = totalStudents > 0 ? (passedStudents / totalStudents) * 100 : 0;
        
        let averageScore = 0;
        if (totalStudents > 0) {
            averageScore = detailedResults.reduce((sum, r) => sum + r.percentage, 0) / totalStudents;
        }

        // Calculate question stats
        const questionStats = [];
        if (exam.questions && results.length > 0) {
            exam.questions.forEach((question, qIndex) => {
                // Count correct answers for this question
                const correctCount = results.reduce((count, result) => {
                    return count + (result.answers[qIndex] === question.correctAnswer ? 1 : 0);
                }, 0);
                
                const correctRate = (correctCount / results.length) * 100;
                
                questionStats.push({
                    questionIndex: qIndex,
                    questionText: question.text,
                    correctRate
                });
            });
        }

        return {
            exam: {
                _id: exam._id,
                title: exam.title,
                description: exam.description,
                date: exam.date,
                duration: exam.duration,
                totalQuestions: exam.questions.length
            },
            statistics: {
                totalStudents,
                passedStudents,
                passRate,
                averageScore,
                questionStats
            },
            resultsByClass
        };
    } catch (error) {
        console.error('Error getting exam results for teacher:', error);
        throw error;
    }
}

/**
 * Get student performance data
 * 
 * @param {String} studentId - Student ID
 * @returns {Promise<Object>} Performance data
 */
export async function getStudentPerformance(studentId) {
    try {
        const results = await Result.find({ userId: studentId });
        
        // Get all related exams
        const examIds = results.map(r => r.examId);
        const exams = await Exam.find({ _id: { $in: examIds } });
        
        // Map exam subjects (using title as subject for simplicity)
        const examSubjects = new Map();
        exams.forEach(exam => {
            examSubjects.set(exam._id.toString(), exam.title);
        });
        
        // Group by subject
        const subjectPerformance = {};
        results.forEach(result => {
            const examId = result.examId.toString();
            const subject = examSubjects.get(examId) || 'Unknown';
            
            if (!subjectPerformance[subject]) {
                subjectPerformance[subject] = [];
            }
            
            subjectPerformance[subject].push({
                examId,
                score: result.score,
                percentage: result.percentage,
                date: result.createdAt
            });
        });
        
        // Calculate subject averages
        const subjectAverages = Object.keys(subjectPerformance).map(subject => {
            const results = subjectPerformance[subject];
            const totalPercentage = results.reduce((sum, r) => sum + r.percentage, 0);
            const averageScore = results.length > 0 ? totalPercentage / results.length : 0;
            
            return {
                name: subject,
                averageScore,
                examCount: results.length
            };
        });
        
        // Calculate score distribution
        const scoreDistribution = {
            excellent: 0, // 90-100%
            good: 0,      // 75-89%
            average: 0,   // 60-74%
            needsImprovement: 0 // <60%
        };
        
        results.forEach(result => {
            if (result.percentage >= 90) {
                scoreDistribution.excellent++;
            } else if (result.percentage >= 75) {
                scoreDistribution.good++;
            } else if (result.percentage >= 60) {
                scoreDistribution.average++;
            } else {
                scoreDistribution.needsImprovement++;
            }
        });
        
        // Get recent results
        const recentResults = await Result.find({ userId: studentId })
            .sort({ createdAt: -1 })
            .limit(5);
        
        const detailedRecentResults = await Promise.all(recentResults.map(async result => {
            const exam = await Exam.findById(result.examId);
            return {
                _id: result._id,
                examId: result.examId,
                examTitle: exam?.title || 'Unknown Exam',
                score: result.score,
                percentage: result.percentage,
                date: result.createdAt
            };
        }));
        
        // Get upcoming exams
        const student = await User.findById(studentId);
        const upcomingExams = await Exam.find({
            status: 'published',
            assignedTo: student.class,
            date: { $gt: new Date() }
        })
        .sort({ date: 1 })
        .limit(5)
        .select('_id title description date duration');
        
        return {
            totalExams: results.length,
            averageScore: results.length > 0 ? 
                results.reduce((sum, r) => sum + r.percentage, 0) / results.length : 0,
            scoreDistribution,
            subjects: subjectAverages,
            recentResults: detailedRecentResults,
            upcomingExams
        };
    } catch (error) {
        console.error('Error getting student performance:', error);
        throw error;
    }
}
