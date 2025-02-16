// const { MailtrapClient } = require("mailtrap");
// require("dotenv").config();
const nodemailer = require("nodemailer");
require("dotenv").config();

const sendMailtrapEmail = async (email, verificationToken) => {
    const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io", // Replace with your Mailtrap host
        port: 2525,                      // Mailtrap SMTP port
        auth: {
            user: process.env.MAILTRAP_USER, // Mailtrap SMTP username
            pass: process.env.MAILTRAP_PASS, // Mailtrap SMTP password
        },
    });

    const mailOptions = {
        from: '"Mailtrap Test" <hello@demomailtrap.com>',
        to: "eleomarfaafajutnao@gmail.com",
        subject: "Verify your email",
        text: `Your verification token is: ${verificationToken}`,
    };
    console.log("USER: ", process.env.MAILTRAP_USER)
    console.log("PASS: ", process.env.MAILTRAP_PASS)
    console.log("TOKEN: ", verificationToken)
    console.log("EMAIL: ", email)

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.messageId);
    } catch (error) {
        console.error(`Error sending email to ${email}:`, error.message);
        throw error;
    }
};

module.exports = { sendMailtrapEmail };




// Looking to send emails in production? Check out our Email API/SMTP product!
// const { MailtrapClient } = require("mailtrap");

// const TOKEN = "f8f8f24b7f7e58cc12cae1a02cf49de9";

// const client = new MailtrapClient({
//   token: TOKEN,
//   testInboxId: 3406814,
// });

// const sender = {
//   email: "hello@example.com",
//   name: "Mailtrap Test",
// };
// const recipients = [
//   {
//     email: "eleomarfaafajutnao@gmail.com",
//   }
// ];

// client.testing
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     text: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);