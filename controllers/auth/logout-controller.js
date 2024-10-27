const Users = require('../../model/user-model');
const jwt = require('jsonwebtoken');

const handleLogout = async (req, res) => {
    const cookies = req.cookies

    // check if the JWT cookie is present
    if(!cookies?.jwt) return res.sendStatus(204);  

    // define the token
    const refreshToken = cookies.jwt;

    try {
        // check if the refresh token exists in the database
        const foundUser = await Users.findOne({ refreshToken }).exec();
        if (!foundUser) {
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
            return res.sendStatus(204);
        }

        // delete refresh token in DB
        foundUser.refreshToken = '';
        const result = await foundUser.save();
        console.log("Logout: ", result);

        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        // res.sendStatus(204)
        return res.status(200).json({ message: "Successfully logged out" });
    } catch (error) {
        console.error("Logout error:", error);
        res.sendStatus(500);
    }
}

module.exports = { handleLogout };