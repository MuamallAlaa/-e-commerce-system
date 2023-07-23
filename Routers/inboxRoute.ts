const express = require("express");
const router = express.Router();
import { CreateMessage } from "../controllers/InboxControllers";
import { Protected, roles } from "../controllers/AuthControllers";
router.route("/").post(Protected, roles("ADMIN"), CreateMessage);

export { router };
