import { Response } from "express";
import { ApiResponse } from "../contracts/api";

export function sendSuccess<T>(res: Response, data: T, message = "Success", status = 200): Response<ApiResponse<T>> {
  return res.status(status).json({ status, message, data });
}
