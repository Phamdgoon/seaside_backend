import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);
const nodemailer = require("nodemailer");

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

const checkEmail = async (email) => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
        });

        const [rows] = await connection.execute(
            "SELECT email FROM user WHERE email = ?",
            [email]
        );

        if (rows.length > 0) {
            return true;
        }
    } catch (error) {
        console.error("Error checking email:", error);
        return false;
    }
};

const handleRegisterService = async (data) => {
    try {
        let isEmailExist = await checkEmail(data.email);
        if (isEmailExist === true) {
            return {
                EM: "Email is already exist",
                EC: 1,
            };
        }
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
        });

        await connection.execute(
            "INSERT INTO user (email, email_verified) VALUES (?, 0)",
            [data.email]
        );

        // Gửi email xác nhận đăng ký
        await sendRegistrationConfirmationEmail(data.email);

        return {
            EM: "Registration successful. Please check your email to complete the registration.",
            EC: 0,
            DT: "",
        };
    } catch (error) {
        console.log(error);
        return {
            EM: "Error during registration.",
            EC: -4,
            DT: "",
        };
    }
};

const confirmRegistrationByEmail = async (email) => {
    try {
        // Cập nhật trạng thái xác thực email

        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
        });
        await connection.execute(
            "UPDATE user SET email_verified = 1 WHERE email = ?",
            [email]
        );

        connection.end();

        return {
            EM: "Email verification successful. Your account has been activated.",
            EC: 0,
            DT: "",
        };
    } catch (error) {
        console.log(error);
        return {
            EM: "Error during email verification.",
            EC: -5,
            DT: "",
        };
    }
};

const sendRegistrationConfirmationEmail = async (userEmail) => {
    const confirmationLink = `http://localhost:8080/confirm-registration?email=${userEmail}`;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.MAIL_FROM_ADDRESS,
        to: userEmail,
        subject: "Xác nhận đăng ký tài khoản",
        text: `Vui lòng click vào đường link sau để hoàn thành đăng ký: ${confirmationLink}`,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = {
    handleLoginService,
    handleRegisterService,
    confirmRegistrationByEmail,
};
