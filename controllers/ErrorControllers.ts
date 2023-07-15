import { NextFunction, Response } from "express";

module.exports = (err: any, req: object, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (err.isOperational) {
    console.log(err.message);
    res.status(err.statusCode).json({
      status: err.status,

      message: err.message,
    });
  } else {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "%somthing went worng %",
    });
  }
};
