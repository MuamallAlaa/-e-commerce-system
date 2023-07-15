import { NextFunction, Request, Response } from "express";

import { prisma } from "../utilites/prisma";
const catchAysnc = require("../utilites/CatchAysnc");
const Apperror = require("../utilites/ErrorsHandler");
const GetAll = catchAysnc(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await prisma.user.findMany({});

    if (!users) return next(new Apperror("there is no users ", 404));
    res.status(201).json({
      status: "success",
      data: {
        users,
      },
    });
  }
);
const GetUser = catchAysnc(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await prisma.user.findUnique({
      where: {
        Id: req.params.id,
      },
    });
    if (!user) return next(new Apperror("user not found ", 404));

    res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
  }
);
const DeleteUser = catchAysnc(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await prisma.User.delete({
      where: {
        Id: req.params.id,
      },
    });
    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);
const UpdateUser = catchAysnc(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await prisma.User.update({
      where: {
        id: req.params.id,
      },
      data: {
        name: req.body.name,
        email: req.body.email,
      },
    });
    res.status(200).json({
      status: "success",
      data: user,
    });
  }
);
export { GetAll, UpdateUser, DeleteUser, GetUser };
