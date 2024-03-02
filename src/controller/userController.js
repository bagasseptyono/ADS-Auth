const userServices = require('../services/userServices')

const findAllUsers= async (req,res) => {
    try {
        const users = await userServices.findAllUsers()
        return res.status(200).send({
            status: "Success",
            message: "Users Found",
            users: users
        });
    } catch (error) {
        return res.status(400).send({
            status: "Error",
            message: error.message,
        });
    }
}

const findUserById = async (req, res) => {
    const id = req.userData.id
    try {
        const user = await userServices.findUserById(id)
        console.log(user);
        return res.status(200).send({
            status: "Success",
            message: "User Found",
            user: user
        });
    } catch (error) {
        return res.status(400).send({
            status: "Error",
            message: error.message,
        });
    }
}

const createUser = async (req, res) => {
    try {
        const data = req.body;
        const file = req.file; 
        const user = await userServices.createUser(data,file)
        return res.status(201).send({
            status: "Success",
            message: "Success created user",
            data: user,
        });
    } catch (error) {
        return res.status(400).send({
            status: "Error",
            message: error.message,
        });
    }
}

const editUser = async (req, res) => {
    const id = req.userData.id;
    const data = req.body;
    const file = req.file;
    try {
        const user = await userServices.editUser(data,parseInt(id),file);
        return res.status(200).send({
            status: "Success",
            message: "Update User Successfully",
            user
        });
    } catch (error) {
        return res.status(400).send({
            status: "Error",
            message: error.message,
        });
    }
}

const deleteUser = async (req, res) => {
    const id = req.userData.id;
    try {
        const user = await userServices.deleteUser(id);
        if (user) {
            return res.status(200).send({
                status: "Success",
                message: "Delete User Successfully",
            });
        }
        return res.status(400).send({
            status: "Error",
            message: "Failed delete user",
        });
    } catch (error) {
        return res.status(400).send({
            status: "Error",
            message: error.message,
        });
    }
}

module.exports = {
    findAllUsers,
    findUserById,
    createUser,
    editUser,
    deleteUser,
}