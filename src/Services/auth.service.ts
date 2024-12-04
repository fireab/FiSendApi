import { PrismaClient } from "@prisma/client";
import { compareHash, generateAccessToken, hash } from "../util/security";
import { AppError } from "../util/CusotmeError";
const prisma = new PrismaClient();
export class AuthService {
  static async login(username: string, password: string) {
    try {
      let user = await prisma.auth.findUnique({ where: { username } });
      if (!user) {
        throw new AppError(400, ["invalid username or password"]);
      } else {
        // check password
        let isMatch = await compareHash(password, user.password);
        if (!isMatch) {
          throw new AppError(400, ["invalid username or password"]);
        } else {
          return {
            token: generateAccessToken(
              { id: user.id },
              process.env.JWT_SECURITY_KEY as string,
              process.env.JWT_EXPIRATION as string
            ),
            username: user.username,
            emil: user.email,
          };
        }
      }
    } catch (error) {
      throw error;
    }
  }

  static async changePassword(
    id: string,
    oldPassword: string,
    newPassword: string
  ) {
    try {
      let user = await prisma.auth.findUnique({ where: { id: id } });
      if (!user) {
        throw new AppError(400, ["user not found"]);
      } else {
        let isMatch = await compareHash(oldPassword, user.password);
        if (!isMatch) {
          throw new AppError(400, ["incorrect old password"]);
        } else {
          let hashPassword = await hash(newPassword);
          await prisma.auth.update({
            where: { id: id },
            data: { password: hashPassword },
          });
          return "password changed successfully";
        }
      }
    } catch (error) {
      throw error;
    }
  }

  static async updateUser(id: string, data: any) {
    try {
      data.password && delete data.password;
      data.id && delete data.id;
      return await prisma.auth.update({
        where: { id: id },
        data: data,
      });
    } catch (error) {
      throw error;
    }
  }
}
