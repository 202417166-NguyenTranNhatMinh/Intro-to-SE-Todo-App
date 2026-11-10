import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { pool } from "./config/db";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ status: "ok", dbTime: result.rows[0].now });
  } catch (err) {
    next(err);
  }
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: err.message || "Internal server error" });
});

export default app;