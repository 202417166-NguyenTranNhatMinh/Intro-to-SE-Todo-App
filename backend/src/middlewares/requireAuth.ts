import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export type AuthenticatedRequest = Request & {
  userId?: string;
};

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies.session;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret) as { userId: string };
    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
}