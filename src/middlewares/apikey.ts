import { Request, Response, NextFunction } from "express";
import { AppError } from "../util/CusotmeError";

/**
 * Middleware to extract API key from 'x-api-key' header.
 * Adds the extracted key to `req.apiKey`.
 */
export function extractApiKey(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Extract API key from the 'x-api-key' header
  const apiKey = req.headers["x-api-key"]?.toString();

  if (!apiKey) {
    return next(new AppError(401, ["Invalid API key"]));
  }

  // Attach the API key to the request object for downstream use
  (req as any).apiKey = apiKey;
  next();
}
