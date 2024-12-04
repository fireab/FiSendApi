import { NextFunction, Request, Response } from "express";
import { ServiceService } from "../Services/service.service";
import { AppError } from "../util/CusotmeError";

export class ServiceController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      let { serviceName, type, credential } = req.body;
      if (
        !serviceName ||
        !type ||
        !credential ||
        typeof credential !== "object"
      ) {
        return next(
          new AppError(400, ["serviceName, type and credential required"])
        );
      }
      let response = await ServiceService.create(serviceName, type, credential);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      let response = await ServiceService.findAll();
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      let { id } = req.params;
      let response = await ServiceService.findOne(id);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async activateToggle(req: Request, res: Response, next: NextFunction) {
    try {
      let { id } = req.params;
      let response = await ServiceService.activateToggle(id);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async regenerateApiKey(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      let { id } = req.params;
      let response = await ServiceService.regenerateApiKey(id);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
