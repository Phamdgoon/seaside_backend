import * as SellerService from "../services/SellerService";

const addNewCategoryChild = async (req, res) => {
  if (!req.body) {
    return res.status(200).json({
      EM: "Missing parameter!",
      EC: 1,
    });
  }

  try {
    let data = await SellerService.handleAddNewCategoryService(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error from server", // error message
      EC: "-1", // error code
    });
  }
};

const createNewProduct = async (req, res) => {
  console.log(req.body.data);
  if (!req.body) {
    return res.status(200).json({
      EM: "Missing parameter!",
      EC: 1,
    });
  }

  try {
    let data = await SellerService.handleCreateNewProduct(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error from server", // error message
      EC: "-1", // error code
    });
  }
};

const getAllOrders = async (req, res) => {
  if (!req.body.username) {
    return res.status(200).json({
      EM: "Missing parameter", // error message
      EC: "1", // error code
    });
  }

  try {
    let data = await SellerService.getAllOrdersService(req.body.username);
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
    });
  }
};

module.exports = {
  addNewCategoryChild,
  createNewProduct,
  getAllOrders,
};
