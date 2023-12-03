import express from "express";

const router = express.Router();

const initApiRoutes = (app) => {
    return app.use("/", router);
};

export default initApiRoutes;
