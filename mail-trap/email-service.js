// emailService.js
const sgMail = require('@sendgrid/mail');
require("dotenv").config();

// Set SendGrid API key from environment variable
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Create the email message
const createVerificationEmail = (email, verificationToken) => {
    const msg = {
        to: email, // recipient's email
        from: 'your-email@example.com', // your verified SendGrid email
        subject: 'Verify your email',
        text: `Your verification token is: ${verificationToken}`,
        html: `<strong>Your verification token is: ${verificationToken}</strong>`,
    };

    return msg;
};

// Send the email
const sendVerificationEmail = async (msg) => {
    try {
        await sgMail.send(msg);
        console.log('Verification email sent successfully.');
    } catch (error) {
        console.error("Error sending verification email:", error.message);
        throw new Error("Failed to send verification email.");
    }
};

module.exports = { createVerificationEmail, sendVerificationEmail };