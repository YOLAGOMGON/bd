import "dotenv/config";

export const env = {
  APP_PORT: process.env.APP_PORT || 3000,
  DB: {
    HOST: process.env.DB_HOST || "localhost",
    PORT: Number(process.env.DB_PORT || 5432),
    USER: process.env.DB_USER || "postgres",
    PASSWORD: process.env.DB_PWD || "",
    NAME: process.env.DB_NAME || "db_megastore_exam"
  },
  MONGO: {
    URI: process.env.MONGO_URI_DB || "mongodb://localhost:27017/db_megastore_exam"
  }
};
