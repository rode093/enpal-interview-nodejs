import { Request, Response } from "express";
import { IUrl } from "../interfaces/url.interface";
import { Url } from "../classes/url";

export class UrlController {
  async createShortUrl(req: Request, res: Response) {
    console.log(
      "🚀 ~ file: url.controller.ts:6 ~ UrlController ~ createShortUrl ~ req:",
      req.body
    );
    try {
      const url = new Url(<IUrl>{ redirect_url: req.body.url });
      await url.save();
      res.status(200).json({
        result: "success",
        message: `URL Created /${url.slug} -> ${url.redirect_url}`,
      });
    } catch (error: any) {
      if (error.constructor.name == "AppException") {
        res
          .status(error.code)
          .json({ result: "error", message: error.message });
      } else {
        res
          .status(500)
          .json({ result: "error", message: "Failed to create short url" });
      }
    }
  }

  async redirectToOriginalUrl(req: Request, res: Response) {
    try {
      const url = await new Url().findBySlug(req.params.slug);
      if (url) {
        return res.redirect(url.redirect_url);
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: url.controller.ts:36 ~ UrlController ~ redirectToOriginalUrl ~ error: Error Executing db lookup",
        error
      );
    }
    res.sendStatus(404);
  }
}
