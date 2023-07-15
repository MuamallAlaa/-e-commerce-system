const express = require("express");
const router = express.Router();
import { signup, signin } from "../controllers/AuthControllers";
import {
  GetAll,
  UpdateUser,
  GetUser,
  DeleteUser,
} from "../controllers/UserControllers";
router.route("/").get(GetAll);
router.route("/singin").post(signin);

router.route("/singup").post(signup);
router.route("/").get(GetAll);

router.route("/:id").get(GetUser).delete(DeleteUser).patch(UpdateUser);

export { router };
