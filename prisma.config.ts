import { defineConfig } from "@prisma/config";
import dotenv from "dotenv";

// Muat variabel dari file .env
dotenv.config();

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});