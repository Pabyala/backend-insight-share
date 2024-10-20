const Users = require('../../model/user-model');
const bcrypt = require('bcrypt');

// singup new user
const signupNewUser = async (req, res) => {
    const { username, firstName, lastName, password, email, gender, phoneNumber, dateOfBirth } = req.body;

    if(!username || !firstName | !lastName || !password || !email || !gender || !phoneNumber || !dateOfBirth) return res.status(400).json({ message: 'All fields are required.'})
    
    const emailDuplicate = await Users.findOne({ email }).exec();
    const phoneNumDuplicate = await Users.findOne({ phoneNumber }).exec();

    if (emailDuplicate) return res.status(400).json({ message: 'Email already exist.' });
    if (phoneNumDuplicate) return res.status(400).json({ message: 'Phone number already exist.' });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await Users.create({
            username, 
            firstName,
            lastName,
            password: hashedPassword,
            email,
            gender,
            phoneNumber,
            dateOfBirth
        })
        console.log("Created user :.", newUser);
        res.status(201).json({ message: 'Sign up successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { signupNewUser };