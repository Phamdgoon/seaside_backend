"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User_Permission extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            User_Permission.belongsTo(models.User, { foreignKey: "username" });
            User_Permission.belongsTo(models.Permission, {
                foreignKey: "id_permission",
            });
        }
    }
    //object relational mapping
    User_Permission.init(
        {
            id_permission: DataTypes.INTEGER,
            username: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "User_Permission",
        }
    );
    return User_Permission;
};
