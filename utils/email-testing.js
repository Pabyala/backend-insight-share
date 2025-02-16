const { MailtrapClient } = require("mailtrap");

const TOKEN = "a0819b72dfbaea730d5a9477616b1d94";

const client = new MailtrapClient({
    token: TOKEN,
});

const sender = {
    email: "hello@demomailtrap.com",
    name: "Mailtrap Test",
};
const recipients = [
    {
        email: "eleomarfaafajutnao@gmail.com",
    }
];

client
    .send({
        from: sender,
        to: recipients,
        subject: "You are awesome!",
        text: "Congrats for sending test email with Mailtrap!",
        category: "Integration Test",
    })
    .then(console.log, console.error);