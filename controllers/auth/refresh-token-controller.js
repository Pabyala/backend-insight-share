const Users = require('../../model/user-model');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies

    // check if the JWT cookie is present
    if(!cookies?.jwt) return res.sendStatus(401); 

    const refreshToken = cookies.jwt;

    // check if the refresh token exists in the database
    const foundUser = await Users.findOne({ refreshToken }).exec();
    if (!foundUser) return res.sendStatus(403); // Forbidden

    // evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
            // create new access token      
            const accessToken = jwt.sign(
                // { "id": decoded._id, "username": decoded.username }, // orig
                { "id": foundUser._id, "username": foundUser.username },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' } 
            )
            // res.json({ accessToken }) // orig
            res.json({ accessToken, id: foundUser._id, username: foundUser.username });
        }
    )
}

module.exports = { handleRefreshToken };