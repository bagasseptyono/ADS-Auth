const express = require("express");
const router = express.Router();

const authService = require("../services/authServices");

const register = async (req, res) => {
    try {
        const data = req.body;
        console.log('1');
        const registration = await authService.register(data);
        return res.status(201).send({
            status: "success",
            message: "User created successfully",
            data: registration,
        });
    } catch (error) {
        return res.status(500).send({
            status: "failed",
            message: error.message,
        });
    }
};

const login = async (req, res) => {
    try {
        const data = req.body;
        const { otp, payload } = await authService.login(data);

        console.log(payload);
        // req.session.secret = payload; 
        return res.status(200).json({
            status: "success",
            message: "OTP Has been send, please Insert OTP",
            otp,
            payload
        });
    } catch (error) {
        return res.status(500).send({
            status: "Error",
            message: error.message,
        });
    }
};

const verify2fa = async (req, res) => {
    const { OTP, id } = req.body;
    try {
        const { payload, tokenJWT } = await authService.verify2fa(OTP, id);
        return res.status(200).send({
            status: "Success",
            message: "User login successfully",
            data: payload,
            tokenJWT,
        });
    } catch (error) {
        return res.status(500).send({
            status: "Error",
            message: error.message,
        });
    }
};

module.exports = { register, login, verify2fa };
