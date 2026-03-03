import { Pool } from "pg";
import { env } from "../env.js";

export let pool;

export const connectPostgres = async () => {
  try {
    const poolPg = new Pool({
      host: env.DB.HOST,
      port: env.DB.PORT,
      database: env.DB.NAME,
      user: env.DB.USER,
      password: env.DB.PASSWORD,
      options: "-c search_path=yolanda_gomez"
    });

    await poolPg.connect();
    console.log("Postgres esta conectado");
    pool = poolPg;
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
