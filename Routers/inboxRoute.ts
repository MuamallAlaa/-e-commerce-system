const express = require("express");
const router = express.Router();
import { CreateMessage } from "../controllers/InboxControllers";
router.route("/").post(CreateMessage);

export { router };
