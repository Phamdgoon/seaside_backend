import BuyerService from "../services/BuyerService";

const getCategories = async (req, res) => {
    try {
        let data = await BuyerService.getCategoriesService();
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

const getProducts = async (req, res) => {
    try {
        let data = await BuyerService.getProductsService();
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

const handleBuyerOrder = async (req, res) => {
    try {
        let data = await BuyerService.handleBuyerOrderService(req.body);
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

module.exports = {
    getCategories,
    getProducts,
    handleBuyerOrder,
};
