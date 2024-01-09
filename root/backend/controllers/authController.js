const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');


// @desc    Login
// @route   POST /api/auth
// @access  Public
const login = asyncHandler(async (req, res) => {

})

// @desc    Refresh Token
// @route   GET /api/auth/refresh
// @access  Public - because we are sending a new token
const refresh = (req, res) => {

}

// @desc    Logout
// @route   POST /api/auth/logout
// @access  Public - just to clear the cookie
const logout = (req, res) => {
    
}

module.exports = {
    login,
    refresh,
    logout
}