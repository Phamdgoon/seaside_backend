import express from "express";
import LoginRegisterController from "../controller/LoginRegisterController";
import BuyerController from "../controller/BuyerController";
import SellerController from "../controller/SellerController";

const router = express.Router();

const initApiRoutes = (app) => {
  router.post("/login", LoginRegisterController.handleLogin);
  router.post("/register-buyer", LoginRegisterController.handleRegisterBuyer);
  router.post("/register-seller", LoginRegisterController.handleRegisterSaler);
  router.get(
    "/confirm-registration",
    LoginRegisterController.confirmRegistration
  );
  router.get("/get-categories", BuyerController.getCategories);
  router.get("/get-products", BuyerController.getProducts);

  router.post("/add-new-category-child", SellerController.addNewCategoryChild);

  router.post("/buyer-order", BuyerController.handleBuyerOrder);

  router.post("/create-new-product", SellerController.createNewProduct);

  router.post("/get-orders", SellerController.getAllOrders);
  return app.use("/", router);
};

export default initApiRoutes;
