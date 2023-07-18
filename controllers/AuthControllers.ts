import { NextFunction, Request, Response } from "express";
import { IsPssCorrect } from "../utilites/cryptography";
import { errorfeatures as AppError } from "../utilites/ErrorsHandler";
import { OtpSend, OtpVerfiy } from "../utilites/otp";
import { prisma } from "../utilites/prisma";
const CatchAysnc = require("../utilites/CatchAysnc");
const client = require("twilio")(
  "AC796018843aab82291cfdd2484cee2887",
  "9102a23e0cff05b5e4abe620e173b688"
);
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
    const sand = await OtpSend(req.body.phonenumber);
    res.status(201).json({
      message: "code sent successfully",
      status: "success",
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
    if (!user.active) {
      await OtpSend(user.phonenumber);
      return res.status(200).json({
        status: "success",
        message: "verfication code have been successfuly sent ",
      });
    }

    const token = singToken(user.id);
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
const Protected = CatchAysnc(async (req: any, res: any, next: any) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(new AppError("unauthorized access", 401));
  }
  const promisejwt = promisify(jwt.verify);
  const data = await promisejwt(token, process.env.KEY);
  console.log(data);
  const user = await prisma.user.findUnique({
    where: {
      id: data.userID,
    },
  });

  if (!user) {
    return next(new AppError("user no longer exists", 404));
  }
  if (user.passwordchangeat > data.iat) {
    console.log("frfr");
    return next(new AppError("token expire", 403));
  }

  req.user = user;
  console.log(user);
  next();
});

const roles = (...rol: any) => {
  return (req: any, res: any, next: NextFunction) => {
    if (rol.includes(req.user.Role)) {
      return next();
    } else {
      next(new AppError(" premisson denied", 403));
    }
  };
};
// export { roles, signup, signin, Protected };
const VerfiyCode = CatchAysnc(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await prisma.User.findUnique({
      where: {
        phonenumber: req.body.phonenumber,
      },
    });
    if (!user)
      return next(new AppError("there is no user with this phone number", 404));
    if (!(await OtpVerfiy(req.body.phonenumber, req.body.code)))
      return next(new AppError("incorect code", 403));
    const updateuser = await prisma.User.update({
      data: {
        active: true,
      },
      where: {
        phonenumber: req.body.phonenumber,
      },
    });
    const token = singToken(user.id);
    res.status(201).json({
      message: "verfied successfuly",
      status: "success",
      token,
    });
  }
);
const CheangePassword = CatchAysnc(
  async (req: any, res: Response, next: NextFunction) => {
    const user = await prisma.User.findUnique({
      where: {
        id: req.user.id,
      },
    });
    console.log(user.password);

    if (!(await IsPssCorrect(req.body.password, user.password))) {
      return next(new AppError("your password incorect", 403));
    }
    const updatedUser = await prisma.User.update({
      where: {
        id: req.user.id,
      },
      data: {
        password: req.body.newpassword,
        passwordchangeat: new Date(),
      },
    });
    res.status(201).json({
      message: "passwordchaged",
      status: "success",
    });
  }
);
const ForgetPassowrd = CatchAysnc(
  async (req: any, res: Response, next: NextFunction) => {
    const user = await prisma.User.findUnique({
      where: {
        phonenumber: req.body.phonenumber,
      },
    });
    if (!user)
      return next(
        new AppError("there is now user with this  phone number", 404)
      );
    const op = await OtpSend(user.phonenumber);

    res.status(201).json({
      message: "code sent",
      status: "success",
    });
  }
);
const RestPassord = CatchAysnc(
  async (req: Request, res: Response, next: NextFunction) => {
    const otp = await OtpVerfiy(req.params.phonenumber, req.body.code);
    if (!(otp.status === "approved"))
      return next(new AppError("the provided code invald", 403));

    const updatedUser = await prisma.User.update({
      where: {
        phonenumber: req.params.phonenumber,
      },
      data: {
        password: req.body.newpassword,
        passwordchangeat: new Date(),
      },
    });
    res.status(201).json({
      message: "passwordchaged",
      status: "success",
    });
  }
);

export {
  signup,
  signin,
  VerfiyCode,
  roles,
  Protected,
  CheangePassword,
  ForgetPassowrd,
  RestPassord,
};
