const jwt = require("jsonwebtoken")

const auth = async (req, res, next) => {
    try {
        if(!req.headers.authorization){
            return res.status(401).json({ message: "Access Denied" })
        }
        const token = req.headers.authorization.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Access Denied" })
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET)

        req.user = verified._id

        next()
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message })
    }
}

module.exports = auth