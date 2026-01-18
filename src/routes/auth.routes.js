import express from "express";
import {
  oauthLogin,
  oauthCallback,
  logoutUser,
  signupUser,
  loginUser
} from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/oauth/:provider", oauthLogin);
router.get("/callback", oauthCallback);
router.post("/logout", logoutUser);
router.post("/signup", signupUser);
router.post("/login", loginUser);

export default router;
