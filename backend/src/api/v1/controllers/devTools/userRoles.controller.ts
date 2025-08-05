import { PrismaClient, UserRole } from "@prisma/client";
import { Request, Response } from "express";
import { statusCodes } from "@/constants";

const prisma = new PrismaClient();

const updateUserRole = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId, newRole } = req.body;

    if (!userId || !newRole) {
      return res.status(statusCodes.badRequest).json({
        statusCode: res.statusCode,
        message: "User ID and new role are required"
      });
    }

    const findUser = await prisma.user.findUnique({
      where: { googleId: String(userId) },
    });

    if (!findUser) {
      return res.status(statusCodes.notFound).json({
        statusCode: res.statusCode,
        message: "User not found"
      });
    };

    const validRoles = Object.values(UserRole);

    if (!validRoles.includes(newRole)) {
      return res.status(statusCodes.badRequest).json({
        statusCode: res.statusCode,
        message: "Invalid role provided"
      });
    }

    await prisma.user.update({
      where: { googleId: String(userId) },
      data: { role: newRole }
    });

    return res.status(statusCodes.success).json({
      statusCode: res.statusCode,
      message: "User role updated successfully"
    });

  } catch (error) {
    return res.status(statusCodes.internalServerError).json({
      statusCode: res.statusCode,
      message: "Internal server error"
    });
  }
};

export { updateUserRole };