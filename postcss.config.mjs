import { defineConfig } from "@prisma/config";


const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});

