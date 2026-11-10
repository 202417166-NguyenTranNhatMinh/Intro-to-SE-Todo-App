import dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set in .env");
}

export const env = {
  port: Number(process.env.PORT) || 4000,
  databaseUrl,
};