import express from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  sendEmail,
} from "./controllers.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/send", sendEmail);

export default router;
