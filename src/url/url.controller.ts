import { Request, Response } from "express";

export class UrlController {
  async createShortUrl(req: Request, res: Response) {
    console.log(
      "🚀 ~ file: url.controller.ts:6 ~ UrlController ~ createShortUrl ~ req:",
      req.body
    );
    // const url = new Url(req.body.url);
    // url.save();

    res.setHeader("Content-Type", "text/json");
    res.send("I will save the link");
  }

  async redirectToOriginalUrl(req, res) {
    console.log(`${req.method} ${req.url}`);
    res.setHeader("Content-Type", "text/plain");
    res.send("I should parse the URL and redirect");
  }
}
