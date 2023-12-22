import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);
const nodemailer = require("nodemailer");

require("dotenv").config();

const hashUserPassword = (password) => {
  let hashPassword = bcrypt.hashSync(password, salt);
  return hashPassword;
};

const checkPassword = (password, hashPassword) => {
  return bcrypt.compareSync(password, hashPassword);
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

        if (isCorrectPassword) {
          const [permissionRows] = await connection.execute(
            "SELECT * FROM user_permission WHERE username = ?",
            [user.username]
          );

          const [profileRows] = await connection.execute(
            "SELECT avt, account_name FROM buyer_profile WHERE username = ?",
            [user.username]
          );

          const [shopProfileRows] = await connection.execute(
            "SELECT name_shop FROM shop_profile WHERE username = ?",
            [user.username]
          );

          const [addressShipRows] = await connection.execute(
            "SELECT id,address, phone_number FROM shipping_address WHERE username = ?",
            [user.username]
          );

          if (permissionRows.length > 0) {
            const permissions = permissionRows.map(
              (permissionRow) => permissionRow.id_permission
            );

            const permissionNames = await Promise.all(
              permissions.map(async (permissionId) => {
                const [permissionDetailRows] = await connection.execute(
                  "SELECT name_permission FROM permission WHERE id = ?",
                  [permissionId]
                );
                return permissionDetailRows[0].name_permission;
              })
            );

            const firstPermissionName = permissionNames[0];
            const nameShop =
              shopProfileRows.length > 0 ? shopProfileRows[0].name_shop : null;
            const avatar = profileRows.length > 0 ? profileRows[0].avt : null;
            const accountName =
              profileRows.length > 0 ? profileRows[0].account_name : null;
            const address =
              addressShipRows.length > 0 ? addressShipRows[0].address : null;
            const phone_number =
              addressShipRows.length > 0
                ? addressShipRows[0].phone_number
                : null;
            const id =
              addressShipRows.length > 0 ? addressShipRows[0].id : null;
            return {
              EM: `Logged in with permissions ${firstPermissionName}`,
              EC: 0,
              DT: {
                userName: user.username,
                userPermissions: permissionNames,
                avatar: avatar,
                accountName: accountName,
                nameShop: nameShop,
                address: address,
                phoneNumber: phone_number,
                idShippingAddress: id,
              },
            };
          } else {
            // Trường hợp không có quyền nào được tìm thấy
            return {
              EM: "No permissions found for the user.",
              EC: -4,
              DT: "",
            };
          }
        } else {
          // Trường hợp mật khẩu sai
          return {
            EM: "Incorrect password!",
            EC: 2,
            DT: "",
          };
        }
      } else {
        // Trường hợp email sai
        return {
          EM: "Incorrect email!",
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

const handleRegisterBuyerService = async (data) => {
  try {
    let isEmailExist = await checkEmail(data.email);
    if (isEmailExist === true) {
      return {
        EM: "Email is already exist",
        EC: 1,
      };
    }

    let hashPassword = hashUserPassword(data.password);

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    });

    try {
      // Thêm người dùng vào bảng user
      await connection.execute(
        "INSERT INTO user (email, username, password, phone_number, email_verified) VALUES (?, ?, ?, ?, 0)",
        [data.email, data.username, hashPassword, data.phone_number]
      );

      // Thêm quyền mặc định (id_permission = 3) cho người dùng vào bảng user_permission
      await connection.execute(
        "INSERT INTO user_permission (id_permission, username) VALUES (3, ?)",
        [data.username]
      );

      await connection.execute(
        "INSERT INTO buyer_profile (username, account_name) VALUES (?,?)",
        [data.username, data.account_name]
      );

      await connection.commit();

      // Gửi email xác nhận đăng ký
      await sendRegistrationConfirmationEmail(data.email);

      return {
        EM: "Registration successful. Please check your email to complete the registration.",
        EC: 0,
        DT: "",
      };
    } catch (error) {
      await connection.rollback();
      console.log(error);
      return {
        EM: "Error during registration.",
        EC: -4,
        DT: "",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      EM: "Error during registration.",
      EC: -4,
      DT: "",
    };
  }
};
const handleRegisterSalerService = async (data) => {
  try {
    let isEmailExist = await checkEmail(data.email);
    if (isEmailExist === true) {
      return {
        EM: "Email is already exist",
        EC: 1,
      };
    }

    let hashPassword = hashUserPassword(data.password);

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    });

    try {
      // Thêm người dùng vào bảng user
      await connection.execute(
        "INSERT INTO user (email, username, password, phone_number, email_verified) VALUES (?, ?, ?, ?, 0)",
        [data.email, data.username, hashPassword, data.phone_number]
      );

      // Thêm quyền mặc định (id_permission = 3) cho người dùng vào bảng user_permission
      await connection.execute(
        "INSERT INTO user_permission (id_permission, username) VALUES (2, ?)",
        [data.username]
      );

      await connection.execute(
        "INSERT INTO shop_profile (username, name_shop) VALUES (?,?)",
        [data.username, data.name_shop]
      );

      await connection.commit();

      // Gửi email xác nhận đăng ký
      await sendRegistrationConfirmationEmail(data.email);

      return {
        EM: "Registration successful. Please check your email to complete the registration.",
        EC: 0,
        DT: "",
      };
    } catch (error) {
      await connection.rollback();
      console.log(error);
      return {
        EM: "Error during registration.",
        EC: -4,
        DT: "",
      };
    }
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
  handleRegisterBuyerService,
  handleRegisterSalerService,
  confirmRegistrationByEmail,
};
