import express from "express";
import LoginRegisterController from "../controller/LoginRegisterController";
const router = express.Router();

const initApiRoutes = (app) => {
    router.post("/login", LoginRegisterController.handleLogin);

    return app.use("/", router);
};

export default initApiRoutes;
