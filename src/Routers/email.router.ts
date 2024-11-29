import express, { Router } from "express";
let router: Router = express.Router();
import { EmailController } from "../controllers/email.controller";
router.post("/sendEmail", EmailController.sendEmail);
export default router;
