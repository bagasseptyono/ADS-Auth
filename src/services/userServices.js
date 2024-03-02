const { User } = require("../db/models");
const bcrypt = require("bcrypt");
const fs = require("fs");

const findUserByEmailOrTelpNumber = async (email, telpNumber) => {
    const whereClause = {};
    if (email) {
        whereClause.email = email;
    }
    if (telpNumber) {
        whereClause.telpNumber = telpNumber;
    }

    const user = await User.findOne({
        where: whereClause,
    });
    return user;
};

const findUserById = async (id) => {
    const user = await User.findOne({
        where: { id },
        attributes: {
            exclude: ["password", "secret", "createdAt", "updatedAt"],
        },
    });
    if (!user) {
        throw Error("User Not Found");
    }
    return user;
};

const findAllUsers = async () => {
    const users = await User.findAll({
        attributes: {
            exclude: ["password", "secret", "createdAt", "updatedAt"],
        },
    });
    return users;
};

const createUser = async (data, file) => {
    // validation
    if (!data.email && !data.telpNumber) {
        throw Error("Insert Email/TelpNumber");
    }
    if (!data.password) {
        throw Error("Insert Password");
    }
    const checkAccount = await findUserByEmailOrTelpNumber(
        data.email,
        data.telpNumber
    );
    if (
        data.email == checkAccount.email ||
        data.email == checkAccount.telpNumber
    ) {
        throw Error("Email/TelpNumber Has been used");
    }
    // hash password
    const password = await bcrypt.hash(data.password, 10);
    data.password = password;
    // create filename
    const fileName = String(
        Date.now() +
            "-" +
            Math.round(Math.random() * 1e2) +
            "-" +
            file.originalname.replace(/\s+/g, "")
    );
    const pathName = "public/uploads/";
    const photo_profile = pathName + fileName;
    // store if file exist
    if (file) {
        data.photo_profile = photo_profile;
        const user = await User.create(data);
        if (!user) {
            throw Error("Failed when created user");
        }
        fs.writeFileSync(pathName + fileName, file.buffer);
        return user;
    }
    const user = await User.create(data);
    return user;
};

const editUser = async (data, id, file) => {
    // validate
    if (data.id) {
        throw Error("Id cannot be change");
    }
    const checkAccount = await findUserByEmailOrTelpNumber(
        data.email,
        data.telpNumber
    );
    if (
        data.email == checkAccount.email ||
        data.email == checkAccount.telpNumber
    ) {
        throw Error("Email/TelpNumber Has been used");
    }
    // hash password
    if (data.password) {
        const password = await bcrypt.hash(data.password, 10);
        data.password = password;
    }
    if (file) {
        const oldData = await findUserById(id);

        if (oldData.photo_profile != null) {
            fs.unlink(oldData.photo_profile, (err) => {
                if (err) {
                    console.error("Error deleting file:", err);
                }
                console.log("File deleted successfully");
            });
        }

        const fileName = String(
            Date.now() +
                "-" +
                Math.round(Math.random() * 1e2) +
                "-" +
                file.originalname.replace(/\s+/g, "")
        );
        const pathName = "public/uploads/";
        const photo_profile = pathName + fileName;
        data.photo_profile = photo_profile;
        const userUpdate = await User.update(
            { ...data },
            {
                where: {
                    id: id,
                },
            }
        );
        if (!userUpdate) {
            throw Error("Error when create User");
        }
        fs.writeFileSync(pathName + fileName, file.buffer);
        const user = await findUserById(id);
        return user;
    }
    const userUpdate = await User.update(
        { ...data },
        {
            where: {
                id: id,
            },
        }
    );
    if (!userUpdate) {
        throw Error("Error when create User");
    }
    const user = await findUserById(id);
    return user;
};

const deleteUser = async (id) => {
    const oldData = await findUserById(id);
    if (oldData.photo_profile != null) {
        fs.unlink(oldData.photo_profile, (err) => {
            if (err) {
                console.error("Error deleting file:", err);
            }
            console.log("File deleted successfully");
        });
    }

    const user = await User.destroy({
        where: {
            id: id,
        },
    });
    if (!user) {
        throw Error("Error when delete user");
    }
    return user;
};

module.exports = {
    findUserByEmailOrTelpNumber,
    findUserById,
    findAllUsers,
    createUser,
    editUser,
    deleteUser,
};
