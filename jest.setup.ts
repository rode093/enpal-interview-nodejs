import { configDotenv } from "dotenv";
import mongoose from "mongoose";

configDotenv();

if (!process.env.DATABASE_URL) {
  throw new Error("DB Configuration not found");
}
mongoose.Promise = Promise;
mongoose.connect(process.env.DATABASE_URL);
mongoose.connection.on("error", () => {
  throw new Error("DB Connection failed");
});
