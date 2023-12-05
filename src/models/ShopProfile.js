"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Shop_Profile extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Shop_Profile.belongsTo(models.User, { foreignKey: "username" });
        }
    }
    //object relational mapping
    Shop_Profile.init(
        {
            name_shop: DataTypes.STRING,
            username: DataTypes.STRING,
            address: DataTypes.STRING,
            description: DataTypes.STRING,
            cover_image: DataTypes.STRING,
            avt: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Shop_Profile",
        }
    );
    return Shop_Profile;
};
