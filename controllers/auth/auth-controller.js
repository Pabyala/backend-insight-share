const bcrypt = require('bcrypt');
const Users = require('../../model/user-model');
const jwt = require('jsonwebtoken');

// singinuser authentication 
const signinUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password ) return res.status(400).json({ message: 'Email and password are required.'})
    
    const foundUser = await Users.findOne({ email }).exec();
    if (!foundUser) return res.status(401).json({ message: 'Email not registered.' });

    const isMath = await bcrypt.compare(password, foundUser.password);
    if (isMath) {
        // create JWT
        const accessToken = jwt.sign(
            { "id": foundUser._id, _id: foundUser._id, "username": foundUser.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' } 
        );
        const refreshToken = jwt.sign(
            { "id": foundUser._id, "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' } 
        );
        // saving refreshToken with current user
        foundUser.refreshToken = refreshToken;
        await foundUser.save();

        // creates secure cookie with refresh token
        res.cookie('jwt', refreshToken, { 
            httpOnly: true, 
            secure: true, 
            sameSite: 'None', 
            maxAge: 24 * 60 * 60 * 1000 
        });

        res.json({ accessToken, email: foundUser.email, _id: foundUser._id, isVerified: foundUser.isVerified });
    } else {
        return res.status(401).json({ message: 'Incorrect password.' });
    }
}

module.exports = { signinUser };