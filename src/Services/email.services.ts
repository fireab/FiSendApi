import nodemailer from "nodemailer";
import dotenv from "dotenv";
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
  static async sendEmail(email: string, subject: string, message: string) {
    console.log(
      `user: ${process.env.EMAILUSERNAME}`,
      `password:${process.env.EMAILPASSWORD}`
    );
    const transporter = await this.getTransporter(
      process.env.EMAILUSERNAME as string,
      process.env.EMAILPASSWORD as string
    );

    const mailOptions = {
      from: process.env.USER as string,
      to: email,
      subject: subject,
      text: message,
    };

    return await transporter.sendMail(mailOptions);
  }
}
