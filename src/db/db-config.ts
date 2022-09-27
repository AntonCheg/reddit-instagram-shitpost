import { config } from "dotenv";
import * as path from "path";
import { DataSource } from "typeorm";

config();

export const dataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [path.join(__dirname, "entity/*{.js,.ts}")],
  synchronize: true,
  //   migrations: [path.join(__dirname, "migrations")],
  //   migrationsTableName: "migrations",
});
