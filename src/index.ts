import express from "express";
import { UrlController } from "./url/url.controller";
import { configDotenv } from "dotenv";
import mongoose, { Error } from "mongoose";
async function main() {
  const server = express();
  server.use(express.json());
  configDotenv(); //Configure env varriables

  //Connect to mongo db using mongoose
  try {
    mongoose.Promise = Promise;
    mongoose.connect(process.env.DATABASE_URL);
    mongoose.connection.on("error", (error: Error) => {
      console.log("🚀 ~ file: index.ts:17 ~ Failed to connect to db:", error);
      throw new Error("DB Connection failed");
    });
    mongoose.connection.on("connected", (stream) => {
      console.log("🚀 ~ file: index.ts:19 ~ DB Server is connected");
    });
  } catch (error) {
    console.log("DB Connection failed");
    return;
  }
  const urlController = new UrlController();
  server.get("/link", (req, res) => {
    console.log(`${req.method} ${req.url}`);
    res.setHeader("Content-Type", "text/plain");
    res.send("I should return a 405 error");
  });

  server.post("/link", urlController.createShortUrl);

  server.get("/:slug", urlController.redirectToOriginalUrl);

  server.use(async (req, res) => {
    console.log(`${req.method} ${req.url}`);
    res.setHeader("Content-Type", "text/plain");
    res.send("I should return a 404 error");
  });

  server.listen(3000, () => {
    console.log("Server listening on port 3000");
  });
}

main();
