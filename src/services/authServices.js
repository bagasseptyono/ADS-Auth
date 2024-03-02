const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy")
const dotenv = require("dotenv");
dotenv.config();

const { User } = require("../db/models");

const userService = require("./userServices")

// Register
const register = async (data) => {
    // console.log(data.email);
    // Validation
    if (!data.firstName || !data.lastName || !data.password) {
        throw Error("All Field Must be fulfiled");
    }
    //Check email
    const checkAccount = await userService.findUserByEmailOrTelpNumber(data.email, data.telpNumber);
    if (checkAccount) {
        throw Error("Email/Telp Number Has Been Used");
    }
    // hash password
    const password = await bcrypt.hash(data.password, 10);
    data.password = password;

    const user = await User.create(data);
    if (!user) {
        throw Error("Error Cannot be created");
    }
    return user;
};

// Login
const login = async (data) => {
    // Validation
    if (
        (!data.email && !data.telpNumber) ||
        !data.password
    ) {
        throw Error("All Field Must be fulfiled");
    }
    if (data.email && data.telpNumber) {
        throw Error("Use Email Or Telp Number");
    }
    // Check User
    const user = await userService.findUserByEmailOrTelpNumber(data.email, data.telpNumber);
    if (!user) {
        throw Error("User Not Found");
    }
    // validate password
    checkPassword = bcrypt.compareSync(data.password, user.password);
    if (!checkPassword) {
        throw Error("Wrong Password");
    }
    const secret = speakeasy.generateSecret({length: 20});
    secretToken = secret.base32
    const otp = speakeasy.totp({
        secret: secretToken,
        encoding: 'base32'
    });
    console.log(typeof(secretToken));
    // insert secret otp to db
    await User.update({ secret: secretToken }, {
        where: {
            id: user.id,
        }
    })
    // send payload
    payload = {
        id: user.id,
        email: user.email,
        telpNumber: user.telpNumber
    }
    return { otp, payload };

};

// const 2FA
const verify2fa = async (OTP, id) => {
    // validate
    if (!OTP) {
        throw Error("Insert OTP!");
    }
    if (!id) {
        throw Error("Insert User Id");
    }
    // find user
    const user = await User.findOne({
        where: {
            id: id
        },
        attributes: {
            exclude: ['password']
        }
    });
    if (!user) {
        throw Error("User Not Found");
    }

    // verify OTP
    const tokenValidates = speakeasy.totp.verify({
        secret: user.secret,
        encoding: 'base32',
        token: OTP,
        window: 6
      }); 
    if (!tokenValidates) {
        throw Error("Wrong OTP");
    }
    // create JWT token
    const tokenJWT = jwt.sign(
        { 
            id: user.id, 
            email: user.email, 
            telpNumber: user.telpNumber 
        },
        process.env.JWT_SECRET
    );
    const payload = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        telpNumber: user.telpNumber,
    };

    return { payload, tokenJWT };
} 

const logout = (token) => {
	
};

module.exports = { register, login, verify2fa };
