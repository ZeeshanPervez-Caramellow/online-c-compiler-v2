import express from "express";
import {
  oauthLogin,
  oauthCallback,
  logoutUser
} from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/oauth/:provider", oauthLogin);
router.get("/callback", oauthCallback);
router.post("/logout", logoutUser);

export default router;
