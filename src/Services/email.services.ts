import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { prisma } from "../index";
import { AppError } from "../util/CusotmeError";
import { decryptData } from "../util/security";

export class EmailService {
  private static async getTransporter(username: string, password: string) {
    return nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: username,
        pass: password,
      },
    });
  }

  static async sendEmail(
    email: string,
    subject: string,
    message: string,
    apiKey: string
  ) {
    try {
      const response = await prisma.services.findUnique({
        where: { apikey: apiKey },
        include: { Service_Configs: true },
      });

      if (!response || !response.is_active) {
        throw new AppError(404, ["Wrong or deactivated API key"]);
      }

      const credData = JSON.parse(response.Service_Configs[0].credential);
      const decrypted: any = decryptData(
        credData.encryptedData,
        credData.authTag
      );
      const credential = JSON.parse(decrypted);

      const transporter = await this.getTransporter(
        credential.username,
        credential.password
      );

      const mailOptions = {
        from: process.env.USER as string,
        to: email,
        subject: subject,
        text: message,
      };

      const sentResponse = await transporter.sendMail(mailOptions);
      return `Email sent to ${sentResponse.accepted}`;
    } catch (error) {
      throw error;
    }
  }

  // New method for sending multiple emails
  static async sendMultipleEmails(
    emails: string[],
    subject: string,
    message: string,
    apiKey: string
  ) {
    try {
      const response = await prisma.services.findUnique({
        where: { apikey: apiKey },
        include: { Service_Configs: true },
      });

      if (!response || !response.is_active) {
        throw new AppError(404, ["Wrong or deactivated API key"]);
      }

      const credData = JSON.parse(response.Service_Configs[0].credential);
      const decrypted: any = decryptData(
        credData.encryptedData,
        credData.authTag
      );
      const credential = JSON.parse(decrypted);

      const transporter = await this.getTransporter(
        credential.username,
        credential.password
      );

      const sendMailPromises = emails.map((email) => {
        const mailOptions = {
          from: process.env.USER as string,
          to: email,
          subject: subject,
          text: message,
        };

        return transporter.sendMail(mailOptions);
      });

      // Wait for all email promises to resolve
      const responses = await Promise.all(sendMailPromises);

      // Extract successfully sent emails
      const sentEmails = responses.map((res) => res.accepted).flat();

      return `Emails sent to: ${sentEmails.join(", ")}`;
    } catch (error) {
      throw error;
    }
  }
}
