const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');


// @desc    Login
// @route   POST /api/auth
// @access  Public
const login = asyncHandler(async (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Please provide a username and password' })
    }

    const foundUser = await User.findOne({ username }).exec()

    if (!foundUser || !foundUser.active) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const match = await bcrypt.compare(password, foundUser.password)
    if (!match) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "username": foundUser.username,
                "roles": foundUser.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1m'}
    )

    const refreshToken = jwt.sign(
        { "username": foundUser.username},
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d'}
    )

    res.cookie('jwt', refreshToken, {
        httpOnly: true, // accessible only by the server
        secure: true, // https
        sameSite: 'none', //cross-site cookie
        maxAge: 7*24*60*60*1000 // 7 days expires set to match rT
    })

    // send access token containing user info
    res.json({ accessToken })

})

// @desc    Refresh Token
// @route   GET /api/auth/refresh
// @access  Public - because we are sending a new token
const refresh = (req, res) => {

    const cookies = req.cookies

    if(!cookies?.jwt) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            console.log(decoded.username)
            const foundUser = await User.findOne({ username: decoded.username }).exec()

            if (!foundUser) return res.status(401).json({ message: 'Unauthorizedd' })

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundUser.username,
                        "roles": foundUser.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1m'}
            )

            res.json({ accessToken })
        })
    )

}

// @desc    Logout
// @route   POST /api/auth/logout
// @access  Public - just to clear the cookie
const logout = (req, res) => {
    
    const cookies = req.cookies
    if(!cookies?.jwt) {
        return res.sendStatus(204) // No Content
    }
    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'none',
        secure: true
    })
    res.json({ message: 'cookie cleared' })
}

module.exports = {
    login,
    refresh,
    logout
}