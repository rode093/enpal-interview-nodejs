import express from "express";
import { UrlController } from "./url/url.controller";

async function main() {
  const server = express();
  server.use(express.json());

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
