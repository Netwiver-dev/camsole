/**
 * Email functionality has been removed from the application.
 * This file contains stub functions to prevent errors when called.
 */

export async function sendVerificationEmail(email, token, name) {
    console.log(
        "Email verification has been disabled. Would have sent to:",
        email
    );
    // Return a successful result even though nothing was sent
    return { success: true, message: "Email functionality disabled" };
}

export async function sendPasswordResetEmail(email, token, name) {
    console.log(
        "Password reset email has been disabled. Would have sent to:",
        email
    );
    // Return a successful result even though nothing was sent
    return { success: true, message: "Email functionality disabled" };
}

export async function sendEmail(options) {
    console.log("Email sending has been disabled. Would have sent:", options);
    // Return a successful result even though nothing was sent
    return { success: true, message: "Email functionality disabled" };
}