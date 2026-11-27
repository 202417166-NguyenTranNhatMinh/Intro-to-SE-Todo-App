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
import taskRoutes from "./routes/taskRoutes";
import { AppError } from "./utils/AppError";
import { sendSuccess } from "./utils/response";

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
      sendSuccess(res, { status: "ok", dbTime: result.rows[0].now });
    } catch (error) {
      next(error);
    }
  },
);

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.use((_req, _res, next) => next(AppError.notFound("Endpoint not found")));

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const malformedJson = err instanceof SyntaxError && "body" in err;
  const error = err instanceof AppError ? err : malformedJson ? AppError.badRequest("Invalid JSON body") : new AppError(500, "Internal server error");
  if (error.status >= 500) console.error(err);
  res.status(error.status).json({ status: error.status, message: error.message, data: error.data });
});

export default app;
