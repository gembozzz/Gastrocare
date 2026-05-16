// ============================================
// GastroCare - Prisma Config
// Provides the database URL to the Prisma CLI
// (migrations, generate, studio, etc.)
// ============================================

import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node prisma/seed.js",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
