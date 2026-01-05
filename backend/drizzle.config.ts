import { defineConfig } from "drizzle-kit";
import { ENV } from "./src/config/env";
// "db:push":"drizzle-kit push" => Ajouter dans le package.json


export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: ENV.DATABASE_URL!,
  },
});