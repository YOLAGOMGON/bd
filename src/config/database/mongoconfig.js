import mongoose from "mongoose";
import { env } from "../env.js";

export const connectMongo = async () => {
  try {
    await mongoose.connect(env.MONGO.URI);
    console.log("Mongo esta conectado");
  } catch (error) {
    console.error("Mongo no pudo conectarse. La API seguira sin logs:", error.message);
  }
};
