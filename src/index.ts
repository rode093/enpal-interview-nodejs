import express, { Request, Response } from "express";
import { UrlController } from "./url/url.controller";
import { configDotenv } from "dotenv";
import mongoose, { Error } from "mongoose";
async function main() {
  const server = express();
  server.use(express.json());
  configDotenv(); //Configure env varriables

  //Connect to mongo db using mongoose
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DB Configuration not found");
    }
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
  server.get("/link", (req: Request, res: Response) => {
    res.sendStatus(405);
  });

  server.post("/link", urlController.createShortUrl);

  server.get("/:slug", urlController.redirectToOriginalUrl);

  server.use(async (req: Request, res: Response) => {
    res.sendStatus(404);
  });

  server.listen(3000, () => {
    console.log("Server listening on port 3000");
  });
}

main();
