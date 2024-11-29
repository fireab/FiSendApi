import { Request, Response, NextFunction } from "express";
import { EmailService } from "../Services/email.services";
export class EmailController {
  static async sendEmail(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body.email || !req.body.subject || !req.body.message) {
        return res
          .status(400)
          .json({ message: "email subject and message required" });
      }
      let { email, subject, message } = req.body;
      let response = await EmailService.sendEmail(email, subject, message);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
