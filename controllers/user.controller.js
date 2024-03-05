const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const user = require('../models/user.model' )

const signup = async (req, res) => {
    const { name, email, password } = req.body
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const sameEmail = await user.findOne({email: email})
        if (sameEmail) {
            return res.status(400).json({ message: "User already exists" })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Please enter a valid email address" })
        }

        await user.create({
            name,
            email,
            password: hashedPassword
        })
        res.status(200).json({ message : 'Account created Successfully'})

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message })
    }
}

const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const User = await user.findOne({ email })
        if (!User) {
            return res.status(404).json({ message: "User not found" })
        }

        const validPassword = await bcrypt.compare(password, User.password)
        if (!validPassword) {
            return res.status(400).json({ message: "Wrong password" })
        }

        const currtoken = jwt.sign({ _id: User._id }, process.env.JWT_SECRET)

        res.status(200).json({ message: "logged in", token: currtoken })

    } catch (error) {
        console.log(error);
        res.status(400).json({ errorMessage: error.message })
    }
}

module.exports = { signup, login }