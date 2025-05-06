import db from "../../../lib/mongodb";
import { User } from "../../../lib/models";
import { generateVerificationToken } from "../../../../lib/auth";
import { sendVerificationEmail } from "../../../lib/email";
import bcrypt from "bcryptjs";

export async function POST(req) {
    await db;

    try {
        const { name, email, password, role, class: className } = await req.json();

        // Basic validation
        if (!name || !email || !password || !role) {
            return new Response(
                JSON.stringify({ error: "All fields are required" }), { status: 400 }
            );
        }

        // Validate role
        if (!["teacher", "student"].includes(role)) {
            return new Response(JSON.stringify({ error: "Invalid user role" }), {
                status: 400,
            });
        }

        // If role is student, class is required
        if (role === "student" && !className) {
            return new Response(
                JSON.stringify({ error: "Class is required for student registration" }), { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return new Response(JSON.stringify({ error: "Email already in use" }), {
                status: 409,
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate verification token
        const verificationToken = generateVerificationToken();

        // Create new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            class: className,
            verificationToken,
            isVerified: false,
        });

        await user.save();

        // Send verification email
        await sendVerificationEmail(email, verificationToken, name);

        // Return success (exclude password from response)
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            class: user.class,
        };

        return new Response(
            JSON.stringify({
                message: "Registration successful. Please check your email to verify your account.",
                user: userResponse,
            }), { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
        });
    }
}