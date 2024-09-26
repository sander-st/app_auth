import { createPool } from "mysql2/promise";

const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_PORT } =
  process.env;

export const pool = createPool({
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  port: MYSQL_PORT,
});
