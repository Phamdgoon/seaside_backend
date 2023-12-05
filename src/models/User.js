"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            User.hasMany(models.User_Permission);
            User.hasMany(models.Shop_Profile);
            User.hasMany(models.Buyer_Profile);
        }
    }
    //object relational mapping
    User.init(
        {
            username: DataTypes.STRING,
            email: DataTypes.STRING,
            facebook_id: DataTypes.STRING,
            google_id: DataTypes.STRING,
            phone_number: DataTypes.STRING,
            password: DataTypes.STRING,
            email_verification_token: DataTypes.STRING,
            email_verified: DataTypes.INTEGER,
            remember_token: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "User",
        }
    );
    return User;
};
