const { MailtrapClient } = require("mailtrap");
require("dotenv").config();

const TOKEN = process.env.MAIL_TRAP_TOKEN;

if (!TOKEN) {
    console.error("MAIL_TRAP_TOKEN is not set in environment variables.");
    throw new Error("Mailtrap token not configured.");
}

const mailTrapClient = new MailtrapClient({
    token: TOKEN,
});

const mailTrapSender = {
    email: "hello@demomailtrap.com",
    name: "InsightShare",
};


module.exports = { mailTrapClient, mailTrapSender };
// const recipients = [
//     {
//         email: "eleomarfaafajutnao@gmail.com",
//     },
// ];

// client
//     .send({
//         from: sender,
//         to: recipients,
//         subject: "You are awesome!",
//         text: "Congrats for sending test email with Mailtrap!",
//         category: "Integration Test",
//     })
//     .then(console.log, console.error);