import express, { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { ServiceController } from "../controllers/service.controller";
import authenticateJWT from "../middlewares/authenticate";
let router: Router = express.Router();
router
  .post("/", authenticateJWT, ServiceController.create)
  .get("/", authenticateJWT, authenticateJWT, ServiceController.findAll)
  .get("/:id", authenticateJWT, ServiceController.findOne)
  .patch("/activate/:id", authenticateJWT, ServiceController.activateToggle)
  .patch(
    "/regenerate/:id",
    authenticateJWT,
    ServiceController.regenerateApiKey
  );

export default router;
