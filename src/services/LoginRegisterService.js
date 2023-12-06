import db from "../models/index";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);
require("dotenv").config();

// const hashUserPassword = (password) => {
//     let hashPassword = bcrypt.hashSync(password, salt);
//     return hashPassword;
// };

const checkPassword = (inputPassword, hashPassword) => {
    return bcrypt.compareSync(inputPassword, hashPassword); // true or false
};

const handleLoginService = async (data) => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
        });

        try {
            const [userRows] = await connection.execute(
                "SELECT * FROM user WHERE email = ?",
                [data.email]
            );

            if (userRows.length > 0) {
                const user = userRows[0];
                const isCorrectPassword = checkPassword(
                    data.password,
                    userRows[0].password
                );

                const [permissionRows] = await connection.execute(
                    "SELECT * FROM user_permission WHERE username = ?",
                    [user.username]
                );

                const [profileRows] = await connection.execute(
                    "SELECT avt, account_name FROM buyer_profile WHERE username = ?",
                    [user.username]
                );

                if (isCorrectPassword && permissionRows.length > 0) {
                    const permissions = permissionRows.map(
                        (permissionRow) => permissionRow.id_permission
                    );

                    const permissionNames = await Promise.all(
                        permissions.map(async (permissionId) => {
                            const [permissionDetailRows] =
                                await connection.execute(
                                    "SELECT name_permission FROM permission WHERE id = ?",
                                    [permissionId]
                                );
                            return permissionDetailRows[0].name_permission;
                        })
                    );

                    const firstPermissionName = permissionNames[0];
                    const avatar =
                        profileRows.length > 0 ? profileRows[0].avt : null;
                    const accountName =
                        profileRows.length > 0
                            ? profileRows[0].account_name
                            : null;
                    return {
                        EM: `Logged in with permissions ${firstPermissionName}`,
                        EC: 0,
                        DT: {
                            userName: user.username,
                            userPermissions: permissionNames,
                            avatar: avatar,
                            accountName: accountName,
                        },
                    };
                } else {
                    return {
                        EM: "Your email or password is incorrect!",
                        EC: 1,
                        DT: "",
                    };
                }
            } else {
                return {
                    EM: "Your email or password is incorrect!",
                    EC: 1,
                    DT: "",
                };
            }
        } catch (error) {
            console.log(error);
            return {
                EM: "Error while executing query.",
                EC: -3,
                DT: "",
            };
        } finally {
            connection.end();
        }
    } catch (e) {
        console.error(e);
        return {
            EM: "There's something wrong with the service...",
            EC: -2,
            DT: "",
        };
    }
};

module.exports = {
    handleLoginService,
};
