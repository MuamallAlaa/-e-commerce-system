const express = require("express");
const router = express.Router();
import {
  signup,
  signin,
  VerfiyCode,
  Protected,
  CheangePassword,
  ForgetPassowrd,
  RestPassord,
} from "../controllers/AuthControllers";
import {
  GetAll,
  UpdateUser,
  GetUser,
  DeleteUser,
  GetMyInbox,
} from "../controllers/UserControllers";
router.route("/").get(GetAll);
router.route("/singin").post(signin);

router.route("/singup").post(signup);
router.route("/verfiy").post(VerfiyCode);
router.route("/").get(GetAll);
router.route("/myinbox").get(Protected, GetMyInbox);
router.route("/changepassword").post(Protected, CheangePassword);
router.route("/forgetpassword").post(ForgetPassowrd);
router.route("/restpassword/:phonenumber").post(RestPassord);

// router.route("/:id").get(GetUser).delete(DeleteUser).patch(UpdateUser);

export { router };
