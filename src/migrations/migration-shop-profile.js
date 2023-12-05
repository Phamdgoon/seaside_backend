"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("Shop_Profile", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name_shop: {
                type: Sequelize.STRING,
            },
            username: {
                type: Sequelize.STRING,
            },
            address: {
                type: Sequelize.STRING,
            },
            description: {
                type: Sequelize.STRING,
            },
            cover_image: {
                type: Sequelize.STRING,
            },
            avt: {
                type: Sequelize.STRING,
            },

            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("Shop_Profile");
    },
};
