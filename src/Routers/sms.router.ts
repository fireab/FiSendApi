import { Router } from "express";
let router: Router = Router();
import { SMSController } from "../controllers/sms.controller";
router.post("/sendSms", SMSController.sendSMS);
export default router;
