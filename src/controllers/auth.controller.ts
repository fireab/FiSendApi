import { NextFunction, Request, Response } from "express";
import { AuthService } from "../Services/auth.service";
import { AppError } from "../util/CusotmeError";
import { AuthRequest } from "../middlewares/authenticate";

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body.username || !req.body.password) {
        return next(new AppError(400, ["username and password required"]));
      }
      let { username, password } = req.body;
      let response = await AuthService.login(username, password);
      return res.status(200).json(response);
    } catch (error: any) {
      next(error);
    }
  }

  static async changePassword(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.body.oldPassword || !req.body.newPassword) {
        return next(
          new AppError(400, ["oldPassword and newPassword required"])
        );
      }
      let { oldPassword, newPassword } = req.body;
      let { id } = req.user as any;

      let response = await AuthService.changePassword(
        id,
        oldPassword,
        newPassword
      );
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      let { id } = req.user as any;
      let response: any = await AuthService.updateUser(id, req.body);
      delete response?.password;
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
