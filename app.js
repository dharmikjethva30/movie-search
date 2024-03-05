const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const morgan = require("morgan")

const user = require('./routes/user.route')
const movie = require('./routes/movie.route')

dotenv.config()

const PORT = process.env.PORT || 3000
const app = express()

// To store Logs
// const fs = require('fs')
// let accessLogStream = fs.createWriteStream('./access.log', { flags: 'a' })
// app.use(morgan("combined", { stream: accessLogStream }))

const connect = () => {
    mongoose.connect(process.env.MONGO_URL)
        .then(() => console.log('Connected to MongoDB'))
        .catch((err) => console.log(err))
}

// middlewares
app.use(express.json())
app.use(cors())

app.use(morgan("combined"))

app.get('/', (req, res) => {
    res.status(200).send("Welcome to My blog Application")
})

app.use('/user', user)
app.use('/movie', movie)

//global error handler
app.use((req, res) => {
    if (req.err) {
        res.status(500).send({ error: req.err })
    }
    else {
        res.status(404).send({ error: "404 no such endpoint not found !" })
    }
})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`)
    connect()
})