const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found'})
    }
    res.json(users)
})

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body

    // check if input is valid
    if(!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).send({message:'Invalid inputs!'})
    }

    // check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username'})
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds = 10

    const userObject = { username, "password": hashedPwd, roles}

    // Create and store new user
    const user = await User.create(userObject)
    
    if(user) { // created successfully
        res.status(201).json({message: `New user ${username} created successfully`})
    } else { // failed to create
        res.status(400).json({message: 'User failed to create - Invalid user data'})
    }
})

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, roles, active, password} = req.body 

    // confirm data
    if ( !id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean' ) {
        return res.status(400).json({ message: 'All fields are required'})
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({message: 'User not found'})
    }

    // check for duplicate
    const duplicate = await User.findOne( {username} ).lean().exec()
    // Allow updates to the original user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Username already exists.' })
    }

    user.username = username
    user.roles = roles 
    user.active = active 

    if (password) {
        // Hash password
        user.password = await bcrypt.hash(password, 10) // 10 salt rounds
    }

    const updatedUser = await user.save()

    res.json({message: `${updatedUser.username} updated`})
})

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({message: 'User ID Required'})
    }

    const note = await Note.findOne({ user: id }).lean().exec()
    if (note) {
        return res.status(400).json({message: `This user has associated notes and cannot be deleted.`})
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({message: "User Not Found"})
    }

    const deletedUsername = user.username; // Store the username before deleting
    const deletedId = user._id; // Store the ID before deleting
    await user.deleteOne()

    const reply = `Username ${deletedUsername} with ID ${deletedId} deleted`
    res.json(reply)

})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}

