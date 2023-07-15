import { NextFunction, Request, Response } from "express";
import { IsPssCorrect } from "../utilites/cryptography";

import { prisma } from "../utilites/prisma";
const AppError = require("../utilites/ErrorsHandler");
const CatchAysnc = require("../utilites/CatchAysnc");
// const cryptography = require("../utilites/cryptography");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const singToken = (userID: string) => {
  return jwt.sign({ userID }, process.env.KEY, {
    expiresIn: process.env.KEY_ex,
  });
};
const signup = CatchAysnc(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await prisma.User.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phonenumber: req.body.phonenumber,
      },
    });
    const token = singToken(user.Id);
    res.status(201).json({
      token,
      status: "success",
      data: {
        user,
      },
    });
  }
);
const signin = CatchAysnc(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError("please enter your password and email", 400));
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user || !(await IsPssCorrect(req.body.password, user.password))) {
      return next(new AppError("Your email or password is incorrect", 401));
    }

    const token = singToken(user.Id);
    res.cookie("jwt", token, {
      httpOnly: true,
      expires: new Date(
        Date.now() + <any>process.env.jwt_cookie_ex * 24 * 60 * 60 * 1000
      ),
    });
    res.status(200).json({
      status: "success",
      token,
    });
  }
);

// const signin = CatchAysnc(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return next(new AppError("please enter your password and email", 400));
//     }

//     const user = await prisma.user.findUnique({
//       where: {
//         Email: email,
//       },
//     });
//     if (
//       !user ||
//       !(await cryptography.IsPssCorrect(req.body.password, user.Password))
//     ) {
//       return next(new AppError("Your email or password is incorrect", 401));
//     }

//     const token = singToken(user.Id);
//     res.cookie("jwt", token, {
//       httpOnly: true,
//       expires: new Date(
//         Date.now() + <any>process.env.JWT_COOKIE_EX * 24 * 60 * 60 * 1000
//       ),
//     });
//     res.status(200).json({
//       status: "success",
//       token,
//     });
//   }
// );
// const Protected = CatchAysnc(async (req: any, res: any, next: any) => {
//   let token;
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     token = req.headers.authorization.split(" ")[1];
//   } else if (req.cookies.jwt) {
//     token = req.cookies.jwt;
//   }
//   if (!token) {
//     return next(new AppError("unauthorized access", 401));
//   }
//   const promisejwt = promisify(jwt.verify);
//   const data = await promisejwt(token, process.env.KEY);
//   const user = await prisma.user.findUnique({
//     where: {
//       Id: data.userID,
//     },
//   });
//   if (!user) {
//     next(new AppError("user no longer exists", 404));
//   }

//   req.user = user;
//   console.log(user);
//   next();
// });

// const roles = (...rol: any) => {
//   return (req: any, res: any, next: any) => {
//     if (rol.includes(req.user.Role)) {
//       return next();
//     } else {
//       next(new AppError(" premisson denied", 403));
//     }
//   };
// };
// export { roles, signup, signin, Protected };
export { signup, signin };
