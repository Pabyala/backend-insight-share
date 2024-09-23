const bcrypt = require('bcrypt');
const User = require('../model/user-model');
const jwt = require('jsonwebtoken');


const signinUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password ) return res.status(400).json({ message: 'Username and password are required.'})
    
    const foundUser = await User.findOne({ username }).exec();
    if (!foundUser) return res.status(401).json({ message: 'Username not registered.' });

    const isMath = await bcrypt.compare(password, foundUser.password);
    if (isMath) {
        // create JWT
        const accessToken = jwt.sign(
            { "id": foundUser._id, "username": foundUser.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' } // 10m to 15m
        );
        const refreshToken = jwt.sign(
            { "id": foundUser._id, "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        // saving refreshToken with current user
        foundUser.refreshToken = refreshToken;
        await foundUser.save();
        // const result = await foundUser.save();
        // console.log("Auth: ", result)

        // creates secure cookie with refresh token
        res.cookie('jwt', refreshToken, { 
            httpOnly: true, 
            // secure: true, 
            sameSite: 'None', 
            maxAge: 24 * 60 * 60 * 1000 
        });

        // res.status(201).json({ message: 'Sing in successfully.', accessToken })
        res.json({ accessToken });
    } else {
        return res.status(401).json({ message: 'Incorrect password.' });
    }
}

module.exports = { signinUser };