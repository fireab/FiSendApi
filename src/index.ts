import express from "express";
import dotenv from "dotenv";
import emailRouter from "./Routers/email.router";
import smsRouter from "./Routers/sms.router";

//
dotenv.config();

const app = express();
const port = process.env.PORT || 4040;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/email", emailRouter);
app.use("/api/sms", smsRouter);

app.listen(4040, () => {
  console.log(`Server is running on port ${port}`);
});
