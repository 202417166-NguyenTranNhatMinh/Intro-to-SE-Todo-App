import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { env } from "../config/env";
import {
  createGoogleAuthorizationUrl,
  signInWithGoogleCode,
} from "../services/authService";
import { findUserById } from "../repo/userRepo";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: "lax" as const,
};

export function startGoogleLogin(req: Request, res: Response) {
  const state = crypto.randomBytes(32).toString("hex");

  res.cookie("oauth_state", state, {
    ...COOKIE_OPTIONS,
    maxAge: 10 * 60 * 1000,
    path: "/api/auth/google/callback",
  });

  res.redirect(createGoogleAuthorizationUrl(state));
}

export async function googleCallback(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const code = typeof req.query.code === "string" ? req.query.code : null;
    const state = typeof req.query.state === "string" ? req.query.state : null;

    if (!code || !state || state !== req.cookies.oauth_state) {
      return res.redirect(`${env.frontendUrl}/?authError=invalid_state`);
    }

    res.clearCookie("oauth_state", {
      path: "/api/auth/google/callback",
    });

    const { sessionToken } = await signInWithGoogleCode(code);

    res.cookie("session", sessionToken, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.redirect(env.frontendUrl);
  } catch (error) {
    next(error);
  }
}

export async function getCurrentUser(
  req: Request & { userId?: string },
  res: Response,
  next: NextFunction,
) {
  try {
    const user = await findUserById(req.userId!);

    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    return res.json({ user });
  } catch (error) {
    next(error);
  }
}

export function logout(req: Request, res: Response) {
  res.clearCookie("session", { path: "/" });
  res.status(204).send();
}