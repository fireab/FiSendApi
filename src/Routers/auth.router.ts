import express, { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import authenticateJWT from "../middlewares/authenticate";
let router: Router = express.Router();
router
  .post("/login", AuthController.login)
  .patch("/change-password", authenticateJWT, AuthController.changePassword)
  .patch("/update", authenticateJWT, AuthController.updateUser);
export default router;
