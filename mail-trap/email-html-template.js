const VERIFICATION_EMAIL_TEMPLATE = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(to right, #3B82F6, #2563EB); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Verify Your Email</h1>
        </div>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <p>Hello <span>{firstName}</span>,</p>
            <p>Thank you for signing up! Your verification code is:</p>
            <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #3B82F6;">{verificationCode}</span>
            </div>
            <p>Enter this code on the verification page to complete your registration.</p>
            <p>This code will expire in 15 minutes for security reasons.</p>
            <p>If you didn't create an account with us, please ignore this email.</p>
            <p>Best regards,<br>Insight Share</p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
            <p>This is an automated message, please do not reply to this email.</p>
        </div>
    </body>
    </html>
`;

const RESET_PASSWORD_EMAIL_TEMPLATE = `
    <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(to right, #3B82F6, #2563EB); padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Reset Your Password</h1>
            </div>
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <p>Hello <span>{email}</span>,</p>
                <p>We received a request to reset your password. Please use the token below to proceed with resetting your password:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #3B82F6;">{resetPasswordToken}</span>
                </div>
                <p>Enter this token on the password reset page to set a new password.</p>
                <p>This token will expire in 15 minutes for security reasons.</p>
                <p>If you did not request a password reset, please ignore this email.</p>
                <p>Best regards,<br>Insight Share</p>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
                <p>This is an automated message, please do not reply to this email.</p>
            </div>
        </body>
    </html>
`;


const PASSWORD_RESET_SUCCESS_TEMPLATE = `
    <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset Successful</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(to right, #3B82F6, #2563EB); padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Password Reset Successful</h1>
            </div>
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <p>Hello <span>{firstName}</span>,</p>
                <p>Your password has been successfully reset. You can now log in using your new password.</p>
                <p>If you did not request this change, please contact our support team immediately.</p>
                <p>For security reasons, please do not share your password with anyone.</p>
                <p>Best regards,<br>Insight Share</p>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
                <p>This is an automated message, please do not reply to this email.</p>
            </div>
        </body>
    </html>
`;

const PASSWORD_RESET_REQUEST_TEMPLATE = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(to right, #3B82F6, #2563EB); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Password Reset</h1>
    </div>
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
        <p>Hello,</p>
        <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
        <p>To reset your password, click the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
        <a href="{resetURL}" style="background-color: #3B82F6; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
        </div>
        <p>This link will expire in 1 hour for security reasons.</p>
        <p>Best regards,<br>Your App Team</p>
    </div>
    <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
        <p>This is an automated message, please do not reply to this email.</p>
    </div>
    </body>
    </html>
`;


const WELCOME_EMAIL_TEMPLATE = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Insight Share</title>
    </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(to right, #3B82F6, #2563EB); padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Welcome to Insight Share!</h1>
            </div>
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <p>Hello <span>{firstName}</span>,</p>
                <p>Congratulations! Your account has been successfully verified. Welcome to <strong>Insight Share</strong> – the place where ideas, thoughts, and insights are shared with the world.</p>
                
                <p>Here’s what you can do now:</p>
                <ul>
                    <li>🌟 Share your thoughts and insights with the community</li>
                    <li>💬 Engage in meaningful discussions</li>
                    <li>❤️ React and interact with others’ posts</li>
                    <li>🔔 Get notified when someone interacts with your content</li>
                </ul>

                <p>We’re excited to have you on board! Start sharing your insights today and be part of a growing community.</p>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://www.insightshare.com" 
                    style="background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                    Get Started
                    </a>
                </div>

                <p>If you have any questions or need support, feel free to reach out to us.</p>

                <p>Best regards,<br><strong>Insight Share Team</strong></p>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
                <p>This is an automated message, please do not reply to this email.</p>
            </div>
        </body>
    </html>
`;

module.exports = { 
    VERIFICATION_EMAIL_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
    PASSWORD_RESET_REQUEST_TEMPLATE,
    WELCOME_EMAIL_TEMPLATE,
    RESET_PASSWORD_EMAIL_TEMPLATE,
};