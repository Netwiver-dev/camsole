# Camsole Examination Management System

Camsole is a comprehensive examination management system designed for educational institutions to streamline the process of creating, administering, and evaluating online exams.

## Features

### For Administrators

- User management (students, teachers, administrators)
- Class/department management
- Monitor exam activity and results
- Generate reports and analytics

### For Teachers

- Create and manage exams with various question types
- Set exam parameters (duration, passing score, etc.)
- Review student performance and provide feedback
- Generate certificates for successful students

### For Students

- Take exams in a secure environment
- View upcoming and past exams
- Track personal progress and performance
- Download certificates and result PDFs

## Technical Overview

### Backend Technology

- MongoDB database with Mongoose for data modeling
- NextJS API routes for server functionality
- Authentication and authorization system
- PDF generation for results and certificates

### Frontend Technology

- NextJS for server-side rendering and routing
- React for UI components
- Tailwind CSS for styling
- Responsive design for mobile and desktop

## System Architecture

### Database Models

- User: Stores user information, credentials, and role
- Exam: Contains exam details, questions, and settings
- Attempt: Tracks student exam attempts and progress
- Result: Stores completed exam results
- Certificate: Manages certificates issued to students

### API Endpoints

- `/api/auth/*`: Authentication endpoints
- `/api/exams/*`: Exam management endpoints
- `/api/results/*`: Results and reporting endpoints
- `/api/certificates/*`: Certificate generation and verification
- `/api/classes/*`: Class/department management
- `/api/users/*`: User management

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
EMAIL_HOST=your_email_host
EMAIL_PORT=your_email_port
BASE_URL=your_application_base_url
```

## Key Workflows

### Examination Process

1. Teacher creates an exam and assigns it to class(es)
2. Students receive notification of upcoming exams
3. Student starts exam within the allowed timeframe
4. System tracks progress and enforces time limits
5. Upon completion, exam is automatically graded
6. Results are stored and certificates issued if criteria met

### Certificate Verification

- Each certificate has a unique ID
- Public verification page to check certificate authenticity
- QR codes on certificates link to verification page

## Deployment

The application can be deployed on various platforms:

- Vercel (recommended for NextJS apps)
- DigitalOcean
- AWS
- Google Cloud
- Azure

## Future Enhancements

- Real-time communication during exams
- AI-powered question generation
- Enhanced analytics and reporting
- Integration with learning management systems
- Mobile application
