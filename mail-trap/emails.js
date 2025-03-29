const { WELCOME_EMAIL_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, RESET_PASSWORD_EMAIL_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } = require("./email-html-template");
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
    }
});

const sendVerificationEmail = async (email, verificationToken, firstName) => {
    try {
        const mailOptions = {
            from: '"Insight Share" <no-reply@insightshare.com>',
            to: email,
            subject: 'Verify your email',
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{email}", email).replace("{verificationCode}", verificationToken).replace("{firstName}", firstName)
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Welcome email sent successfully:", info.response);

    } catch (error) {
        console.error("Error creating user:", error.message);
        res.status(500).json({ message: error.message });
    }
};

const sendWelcomeEmail = async (email, firstName) => {
    try {
        const mailOptions = {
            from: '"Insight Share" <no-reply@insightshare.com>',
            to: email,
            subject: 'Welcome to Insight Share!',
            html: WELCOME_EMAIL_TEMPLATE.replace("{firstName}", firstName)
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Welcome email sent successfully:", info.response);

    } catch (error) {
        console.error("Error creating user:", error.message);
        res.status(500).json({ message: error.message });
    }
}

const sendResetPasswordEmail = async (email, resetPasswordToken) => {
    try {
        const mailOptions = {
            from: '"Insight Share" <no-reply@insightshare.com>',
            to: email,
            subject: 'Reset password token',
            html: RESET_PASSWORD_EMAIL_TEMPLATE.replace("{email}", email).replace("{resetPasswordToken}", resetPasswordToken)
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Reset password email sent successfully:", info.response);
    } catch (error) {
        console.error("Error sending reset password email:", error.message);
        res.status(500).json({ message: error.message });
    }
};

const sendSuccessResetPasswordEmail = async (email, firstName) => {
    try {
        const mailOptions = {
            from: '"Insight Share" <no-reply@insightshare.com>',
            to: email,
            subject: 'Password Reset Successful',
            html: PASSWORD_RESET_SUCCESS_TEMPLATE.replace("{firstName}", firstName)
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Reset password email sent successfully:", info.response);
    } catch (error) {
        console.error("Error sending reset password email:", error.message);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    transporter,
    sendVerificationEmail, 
    sendWelcomeEmail,
    sendResetPasswordEmail,
    sendSuccessResetPasswordEmail,
};
