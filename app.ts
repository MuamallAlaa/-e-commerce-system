import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();
const app: Express = express();
import cookieparser from "cookie-parser";
import { router as UserRoutes } from "./Routers/UserRoutes";

app.use(express.json());
app.use(cookieparser());

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("hello world ");
});
app.listen(9999, () => console.log("the server start"));
app.use("/api/v1/users", UserRoutes);
// app.use("/api/v1/users", UsersRrouter);
// app.use("/api/v1/books", BooksRrouter);
// app.use("/api/v1/Categories", CategoriesRouter);

// const prisma = new PrismaClient();
// async function main() {
//   const user = await prisma.user.findMany({
//     data: {
//       Name: "muamall",
//       Pssaword: "gttgtgtg",
//       Email: "muamfr@getMaxListeners.com",
//     },d
// );ddd
//   console.log(user);
// }
// main();
app.use("*", (req: Request, res: Response, next: any) => {
  //   const err = new Error(`this page does't exist ${req.originalUrl}`);
  //   err.status = "fail";
  //   err.statusCode = 404;
  //   next(err);
  // next(new AppError(`this page does't exist ${req.originalUrl}`, 404));
  res.render("this page does't exist");
});
