import LoginRegisterService from "../services/LoginRegisterService";
require("dotenv").config();
const handleLogin = async (req, res) => {
  try {
    let data = await LoginRegisterService.handleLoginService(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error from server", // error message
      EC: "-1", // error code
      DT: "", // data
    });
  }
};
const handleRegisterBuyer = async (req, res) => {
  try {
    let data = await LoginRegisterService.handleRegisterBuyerService(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error from server", // error message
      EC: "-1", // error code
      DT: "", // data
    });
  }
};
const handleRegisterSaler = async (req, res) => {
  try {
    let data = await LoginRegisterService.handleRegisterSalerService(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error from server", // error message
      EC: "-1", // error code
      DT: "", // data
    });
  }
};

const confirmRegistration = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      // Kiểm tra nếu email không tồn tại
      return res.status(400).json({
        EM: "Email parameter is missing",
        EC: -6,
        DT: "",
      });
    }

    // Thực hiện xác nhận email ở đây
    const result = await LoginRegisterService.confirmRegistrationByEmail(email);

    // Render view xác nhận thành công hoặc thông báo lỗi
    res.render("confirmRegistration", { result });
  } catch (error) {
    console.error(error);
    res.render("confirmRegistration", {
      result: { EC: -5, EM: "Error during email verification." },
    });
  }
};

module.exports = {
  handleLogin,
  handleRegisterBuyer,
  handleRegisterSaler,
  confirmRegistration,
};
