import { NextFunction, Request, Response } from "express";
import { IsPssCorrect } from "../utilites/cryptography";
import { errorfeatures as AppError } from "../utilites/ErrorsHandler";
import { prisma } from "../utilites/prisma";
const CatchAysnc = require("../utilites/CatchAysnc");
const CreateMessage = CatchAysnc(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await prisma.User.findMany(); // Fetch all users

    const inbox = await prisma.Inbox.create({
      data: {
        message: req.body.message,
        subject: req.body.subject,
        users: {
          connect: users.map((user: any) => ({ id: user.id })),
        },
      },
    });

    res.status(200).json({
      data: inbox,
    });
  }
);

export { CreateMessage };
