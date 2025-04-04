const Users = require("../../model/user-model");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { generateVerificationToken } = require("../../utils/generat-random-verification-code");
const { sendWelcomeEmail, sendVerificationEmail, sendResetPasswordEmail, sendSuccessResetPasswordEmail } = require("../../mail-trap/emails");

// Sign up new user
const signupNewUser = async (req, res) => {
    const { username, firstName, lastName, password, email, gender, phoneNumber, dateOfBirth } = req.body;

    if (!username || !firstName || !lastName || !password || !email || !gender || !phoneNumber || !dateOfBirth) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const emailDuplicate = await Users.findOne({ email }).exec();
        const phoneNumDuplicate = await Users.findOne({ phoneNumber }).exec();

        if (emailDuplicate) return res.status(400).json({ message: "Email already exists." });
        if (phoneNumDuplicate) return res.status(400).json({ message: "Phone number already exists." });

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = generateVerificationToken();

        const newUser = await Users.create({
            username,
            firstName,
            lastName,
            password: hashedPassword,
            email,
            gender,
            phoneNumber,
            dateOfBirth,    
            verificationToken,
            verificationExpiresAt: Date.now() + 10 * 60 * 1000,
        });

        try {
            await sendVerificationEmail(email, verificationToken, firstName);
        } catch (emailError) {
            return res.status(500).json({ message: "Error sending verification email. Please try again." });
        }
        
        res.status(201).json({ message: "Sign up successful" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const verifyEmail = async (req, res) => {
    const { verificationCode } = req.body;

    try {
        if (!verificationCode) return res.status(400).json({ message: "Enter verification code." });

        const user = await Users.findOne({ verificationToken: verificationCode });

        if(!user) return res.status(400).json({ message: "Invalid verification code." });
        
        if (Date.now() > user.verificationExpiresAt) return res.status(400).json({ message: "Verification code has expired." });

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationExpiresAt = undefined;

        await user.save();

        await sendWelcomeEmail(user.email, user.firstName);

        res.status(201).json({ message: "Email verified successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const resendVerificationCode = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required." });
    }

    try {
        const user = await Users.findOne({ email }).exec();

        if (!user) {
            return res.status(404).json({ message: "Email was not registered." });
        }

        // Generate new verification token
        const verificationToken = generateVerificationToken();
        user.verificationToken = verificationToken;
        user.verificationExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiration

        await user.save();

        // Send new verification email
        await sendVerificationEmail(user.email, verificationToken, user.firstName);

        res.status(200).json({ message: "A new verification code has been sent to your email." });
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
};


const resetPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await Users.findOne({ email });

        if (!user) return res.status(400).json({ message: "Email not found." });

        const resetPasswordToken = generateVerificationToken();
        const resetPasswordExpiresAt = Date.now() + 10 * 60 * 1000; // Token valid for 10m
        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpiresAt = resetPasswordExpiresAt;
        
        await user.save();

        // Send reset password email
        await sendResetPasswordEmail(user.email, resetPasswordToken);

        res.status(200).json({ message: "Reset password token sent successfully.", typeOfCode: 'resetPassword' });
    } catch (error) {
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

const verifyResetPasswordCode = async (req, res) => {
    const { verificationCode } = req.body;

    try {
        if (!verificationCode) return res.status(400).json({ message: "Enter verification code." });

        const user = await Users.findOne({ resetPasswordToken: verificationCode });

        if(!user) return res.status(400).json({ message: "Invalid verification code." });
        
        if (Date.now() > user.resetPasswordExpiresAt) return res.status(400).json({ message: "Verification code has expired." });

        await user.save();

        res.status(201).json({ message: "Verified successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const setNewPassword = async (req, res) => {
    const { resetPasswordToken, newPassword, confirmPassword } = req.body;

    try {
        if (!resetPasswordToken || !newPassword || !confirmPassword) return res.status(400).json({ message: "Required all fields." });

        if(newPassword != confirmPassword) return res.status(400).json({ message: "Password does not match" });

        const user = await Users.findOne({ resetPasswordToken });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token." });
        }

        // check if the token has expired
        if (user.resetPasswordExpiresAt < Date.now()) {
            return res.status(400).json({ message: "Reset token has expired." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined; 
        user.resetPasswordExpiresAt = undefined;

        await user.save();

        await sendSuccessResetPasswordEmail(user.email, user.firstName)

        res.status(200).json({ message: "Password has been successfully updated." });
    } catch (error) {
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};


module.exports = { 
    signupNewUser, 
    verifyEmail, 
    resendVerificationCode,
    resetPassword,
    setNewPassword,
    verifyResetPasswordCode,
};