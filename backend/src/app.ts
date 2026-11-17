import express, {
  Request,
  Response,
  NextFunction,
} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { pool } from "./config/db";
import { env } from "./config/env";
import authRoutes from "./routes/authRoutes";

const app = express();

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get(
  "/api/health",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await pool.query("SELECT NOW()");
      res.json({ status: "ok", dbTime: result.rows[0].now });
    } catch (error) {
      next(error);
    }
  },
);

app.use("/api/auth", authRoutes);

app.use(
  (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({
      message: err.message || "Internal server error",
    });
  },
);

export default app;