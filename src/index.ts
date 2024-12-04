import express from "express";
import dotenv from "dotenv";
import emailRouter from "./Routers/email.router";
import smsRouter from "./Routers/sms.router";
import authRouter from "./Routers/auth.router";
import serviceRouter from "./Routers/service.router";
import crypto from "crypto";
import { decryptData, encryptData } from "./util/security";
import { AppError } from "./util/CusotmeError";
import { timeStamp } from "console";
import { PrismaClient } from ".prisma/client";
// json parser setup
import bodyParser from "body-parser";

//
dotenv.config();

const app = express();
const port = process.env.PORT || 4040;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// global error handler

app.use("/api/email", emailRouter);
app.use("/api/sms", smsRouter);
app.use("/api/auth", authRouter);
app.use("/api/service", serviceRouter);

app.use((error: any, req: any, res: any, next: any) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      statusCode: error.statusCode,
      payload: error.payload,
    });
  } else {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
app.listen(4040, () => {
  console.log(`Server is running on port ${port}`);
});
export const prisma = new PrismaClient();
