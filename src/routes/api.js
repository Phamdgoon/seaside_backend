import express from "express";
import LoginRegisterController from "../controller/LoginRegisterController";
import BuyerController from "../controller/BuyerController";
const router = express.Router();

const initApiRoutes = (app) => {
    router.post("/login", LoginRegisterController.handleLogin);
    router.get("/get-categories", BuyerController.getCategories);

    return app.use("/", router);
};

export default initApiRoutes;
