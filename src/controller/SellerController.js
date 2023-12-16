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

module.exports = {
  addNewCategoryChild,
};
