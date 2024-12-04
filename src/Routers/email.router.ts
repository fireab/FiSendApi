import express, { Router } from "express";
let router: Router = express.Router();
import { EmailController } from "../controllers/email.controller";
import { extractApiKey } from "../middlewares/apikey";
router.post("/send-email", extractApiKey, EmailController.sendEmail);
router.post(
  "/send-multiple-emails",
  extractApiKey,
  EmailController.sendMultipleEmails
);

export default router;
