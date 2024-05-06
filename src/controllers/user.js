const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const validator = require("validator")
const User = require("../models/users")

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
}

const createUser = async (req, res) => {
    try {
        const { username, password, email } = req.body
        if (!username || !password || !email) {
            return res.status(400).send({ message: "Please provide all required fields" })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).send({ message: "Please provide a valid email" })
        }
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).send({ message: "User already exists" })
        }
        const hashedPassword = await hashPassword(password)
        const user = await User.create({ username, password: hashedPassword, email })
        return res.status(201).send({ message: "User created successfully", user })
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).send({ message: "User not found" })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).send({ message: "Invalid password" })
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        return res.status(200).send({ message: "Login successful", token, data: user })
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await User.find()
        if (!users || users.length === 0) {
            return res.status(404).send({ message: "No users found" })
        }
        return res.status(200).send({ message: "Users fetched successfully", users })
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

const getUserById = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).send({ message: "Please provide a valid user ID" })
        }
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).send({ message: "User not found" })
        }
        return res.status(200).send({ message: "User fetched successfully", user })
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

const editUser = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).send({ message: "Please provide a valid user ID" })
        }
        const { username, password, email } = req.body
        if (!username || !password || !email) {
            return res.status(400).send({ message: "Please provide all required fields" })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).send({ message: "Please provide a valid email" })
        }
        const existingUser = await User.findOne({ email })
        if (existingUser && existingUser._id.toString() !== id) {
            return res.status(400).send({ message: "User already exists" })
        }
        const hashedPassword = await hashPassword(password)
        const user = await User.findByIdAndUpdate(id, { username, password: hashedPassword, email }, { new: true })
        if (!user) {
            return res.status(404).send({ message: "Users not found" })
        }
        return res.status(200).send({ message: "User updated successfully", user })
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).send({ message: "Please provide a valid user ID" })
        }
        const user = await User.findByIdAndDelete(id)
        if (!user) {
            return res.status(404).send({ message: "User not found" })
        }
        return res.status(200).send({ message: "User deleted successfully" })
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

module.exports = { createUser, userLogin, getUsers, getUserById, editUser, deleteUser }