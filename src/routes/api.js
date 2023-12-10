import express from "express";
import LoginRegisterController from "../controller/LoginRegisterController";
import BuyerController from "../controller/BuyerController";
const router = express.Router();

const initApiRoutes = (app) => {
    router.post("/login", LoginRegisterController.handleLogin);
    router.post("/register", LoginRegisterController.handleRegister);
    router.get(
        "/confirm-registration",
        LoginRegisterController.confirmRegistration
    );
    router.get("/get-categories", BuyerController.getCategories);
    router.get("/get-products", BuyerController.getProducts);

    return app.use("/", router);
};

export default initApiRoutes;
