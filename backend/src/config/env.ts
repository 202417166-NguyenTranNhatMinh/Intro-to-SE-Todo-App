import dotenv from "dotenv";

dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set in .env`);
  return value;
}

export const env = {
  port: Number(process.env.PORT) || 4000,
  databaseUrl: required("DATABASE_URL"),
  frontendUrl: required("FRONTEND_URL"),
  googleClientId: required("GOOGLE_CLIENT_ID"),
  googleClientSecret: required("GOOGLE_CLIENT_SECRET"),
  googleCallbackUrl: required("GOOGLE_CALLBACK_URL"),
  jwtSecret: required("JWT_SECRET"),
  isProduction: process.env.NODE_ENV === "production",
};