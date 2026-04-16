const { spawnSync } = require("child_process");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is not set in backend/.env");
  process.exit(1);
}

const schemaPath = path.resolve(__dirname, "..", "schema.sql");
const result = spawnSync("psql", [databaseUrl, "-f", schemaPath], {
  stdio: "inherit",
  shell: true,
});

if (result.error) {
  console.error("Failed to run psql:", result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 0);
