const jwt = require('jsonwebtoken');

const userService = require("../services/userServices")

const authenticate = async (req, res, next) => {
	const token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const JWTToken = token.split(" ").pop();
    const secretKey = process.env.JWT_SECRET
    try {
        // Verify Token
        const data = jwt.verify(JWTToken,secretKey)
        const user = await userService.findUserById(data.id)
        if (!user) {
            return res.status(400).send({
                status: "failed",
                message: "User Not Found"
            });
        }
        req.userData = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            telpNumber: user.telpNumber
        };
        console.log("token");
        next();

    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
};

module.exports = { authenticate }