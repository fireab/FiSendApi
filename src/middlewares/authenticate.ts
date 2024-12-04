import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AppError } from "../util/CusotmeError";
import dotenv from "dotenv";
dotenv.config();

// Replace this with your actual secret key
const JWT_SECRET = process.env.JWT_SECURITY_KEY as string;

export interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

const authenticateJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError(401, ["Unauthorized error"]));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user data to the request object
    next();
  } catch (err) {
    return next(new AppError(401, ["Unauthorized error"]));
  }
};

export default authenticateJWT;
