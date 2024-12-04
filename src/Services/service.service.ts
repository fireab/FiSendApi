import { encryptData, generateApiKey } from "../util/security";
import { AppError } from "../util/CusotmeError";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class ServiceService {
  static async create(
    serviceName: string,
    type: "email" | "sms",
    credential: any
  ) {
    try {
      //create email credential
      if (type === "email") {
        if (!credential.password || !credential.username) {
          throw new AppError(400, ["password, username required"]);
        } else {
          let encriptedData = encryptData(JSON.stringify(credential));
          console.log("ecrypted data", encriptedData);

          return await prisma.services.create({
            data: {
              service_name: serviceName,
              apikey: generateApiKey(),
              is_active: true,
              Service_Configs: {
                create: {
                  type: type,
                  credential: JSON.stringify(encriptedData),
                },
              },
            },
          });
        }
      }
      //create sms credential
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    try {
      return await prisma.services.findMany();
    } catch (error) {
      throw error;
    }
  }
  static async findOne(id: string) {
    try {
      return await prisma.services.findUnique({
        where: { id: id },
        include: { Service_Configs: true },
      });
    } catch (error) {
      throw error;
    }
  }

  static async activateToggle(id: string) {
    try {
      let service = await prisma.services.findUnique({ where: { id: id } });
      if (!service) {
        throw new AppError(404, ["service not found"]);
      } else {
        let response = await prisma.services.update({
          where: { id: id },
          data: { is_active: !service.is_active },
        });
        return response.is_active ? "activated" : "deactivated";
      }
    } catch (error) {
      throw error;
    }
  }

  static async regenerateApiKey(id: string) {
    try {
      let service = await prisma.services.findUnique({
        where: { id: id },
      });
      if (!service) {
        throw new AppError(404, ["service not found"]);
      } else {
        let response = await prisma.services.update({
          where: { id: id },
          data: { apikey: generateApiKey() },
        });
        return response.apikey;
      }
    } catch (error) {
      throw error;
    }
  }
}
