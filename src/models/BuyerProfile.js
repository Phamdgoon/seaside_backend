"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Buyer_Profile extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Buyer_Profile.belongsTo(models.User, { foreignKey: "username" });
        }
    }
    //object relational mapping
    Buyer_Profile.init(
        {
            username: DataTypes.STRING,
            account_name: DataTypes.STRING,
            gender: DataTypes.STRING,
            birth_day: DataTypes.STRING,
            avt: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Buyer_Profile",
        }
    );
    return Buyer_Profile;
};
