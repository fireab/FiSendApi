import { Request, Response, NextFunction } from "express";
import { EmailService } from "../Services/email.service";
import { AppError } from "../util/CusotmeError";
export class EmailController {
  static async sendEmail(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body.email || !req.body.subject || !req.body.message) {
        return next(new AppError(400, ["email, subject and message required"]));
      }

      let { email, subject, message } = req.body;
      let response = await EmailService.sendEmail(
        email,
        subject,
        message,
        (<any>req).apiKey
      );
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async sendMultipleEmails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.body.emails || !req.body.subject || !req.body.message) {
        return next(new AppError(400, ["email, subject and message required"]));
      }

      let { emails, subject, message } = req.body;
      let response = await EmailService.sendMultipleEmails(
        emails,
        subject,
        message,
        (<any>req).apiKey
      );
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
