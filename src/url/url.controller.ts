import { Request, Response } from "express";
import { IUrl } from "../interfaces/url.interface";
import { Url } from "../classes/url";
import { Error } from "mongoose";

export class UrlController {
  async createShortUrl(req: Request, res: Response) {
    console.log(
      "🚀 ~ file: url.controller.ts:6 ~ UrlController ~ createShortUrl ~ req:",
      req.body
    );
    const url = new Url(<IUrl>{ redirect_url: req.body.url });
    try {
      await url.create();
      res.status(200).json({
        result: "success",
        message: `URL Created /${url.slug} -> ${url.redirect_url}`,
      });
    } catch (error: any) {
      console.log(
        "🚀 ~ file: url.controller.ts:14 ~ UrlController ~ createShortUrl ~ error",
        error
      );
      res
        .status(500)
        .json({ result: "error", message: `Failed to create the url` });
    }
  }

  async redirectToOriginalUrl(req, res) {
    console.log(`${req.method} ${req.url}`);
    res.setHeader("Content-Type", "text/plain");
    res.send("I should parse the URL and redirect");
  }
}
