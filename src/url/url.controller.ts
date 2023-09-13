import { Request, Response } from "express";
import { IUrl } from "../interfaces/url.interface";
import { Url } from "../classes/url";
import { URL } from "url";
import { restrictedDomains } from "../constants/url.constants";

export class UrlController {
  async createShortUrl(req: Request, res: Response) {
    try {
      const url = new Url(<IUrl>{ redirect_url: req.body.url });
      await url.save();
      res.status(201).json({
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
        if (
          restrictedDomains.includes(new URL(url.redirect_url).hostname) && //checks if url is restricted and if yes, checks if isadult is set true
          req.query.isadult != "true"
        ) {
          res.status(403).json({
            result: "error",
            message: "You're not allowed to access this page",
          });
          return;
        }
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
