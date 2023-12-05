"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("User", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            username: {
                type: Sequelize.STRING,
            },
            email: {
                type: Sequelize.STRING,
            },
            facebook_id: {
                type: Sequelize.STRING,
            },
            google_id: {
                type: Sequelize.STRING,
            },
            phone_number: {
                type: Sequelize.STRING,
            },
            password: {
                type: Sequelize.STRING,
            },
            email_verification_token: {
                type: Sequelize.STRING,
            },
            email_verified: {
                type: Sequelize.INTEGER,
            },
            remember_token: {
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
        await queryInterface.dropTable("User");
    },
};
