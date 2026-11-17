import { Router } from "express";
import {
  getCurrentUser,
  googleCallback,
  logout,
  startGoogleLogin,
} from "../controllers/authController";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

router.get("/google", startGoogleLogin);
router.get("/google/callback", googleCallback);
router.get("/me", requireAuth, getCurrentUser);
router.post("/logout", logout);

export default router;