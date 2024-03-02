"use strict";

const { Sequelize, DataTypes, Model } = require("sequelize");
// const sequelize = new Sequelize('mysql::memory:');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    User.init(
        {
            firstName: DataTypes.STRING,
            lastName: DataTypes.STRING,
            email: DataTypes.STRING,
            telpNumber: DataTypes.STRING,
            password: DataTypes.STRING,
            photo_profile: DataTypes.STRING,
            secret: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "User",
        }
    );
    return User;
};
