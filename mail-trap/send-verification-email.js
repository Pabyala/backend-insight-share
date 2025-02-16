const SibApiV3Sdk = require('sib-api-v3-sdk');

// Initialize Brevo API Client
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_EMAIL_API_KEY; // Store API key in .env for security

console.log("Brevo API Key:", apiKey.apiKey);

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const sendVerificationEmail = async (email, verificationToken) => {

    // const emailData = {
    //     sender: { name: "Your Company", email: "no-reply@yourcompany.com" },
    //     to: [{ email }],
    //     subject: "Email Verification",
    //     htmlContent: `<p>Your OTP Code: <strong>${verificationToken}</strong></p>`
    // };

    const sender = {
        email: "test01@gmail.com",
        name: "Insight Share"
    }

    const receivers = [{
        email
    }]

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
            <h2 style="color: #333;">Email Verification</h2>
            <p>Your OTP Code is:</p>
            <h3 style="background: #f4f4f4; padding: 10px; display: inline-block;">${verificationToken}</h3>
            <p>This code will expire in 24 hours.</p>
            <p>If you didn't request this, please ignore this email.</p>
        </div>
    `;

    try {
        // await apiInstance.sendTransacEmail(emailData);
        const sendEmail = await apiInstance.sendTransacEmail({
            sender,
            to: receivers,
            subject: "Test Email From Insight Share",
            textContent: `Your OTP Code is: ${verificationToken}`,
            htmlContent
        })
        console.log("Verification email sent successfully.");
        return sendEmail;
    } catch (error) {
        console.error("Error sending verification email:", error.message);
    }
};

module.exports = { sendVerificationEmail };
