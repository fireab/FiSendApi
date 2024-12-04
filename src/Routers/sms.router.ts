import { Router } from "express";
let router: Router = Router();
import { SMSController } from "../controllers/sms.controller";
import { extractApiKey } from "../middlewares/apikey";
router.post("/sendSms", extractApiKey, SMSController.sendSMS);
export default router;
