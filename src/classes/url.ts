import { IUrl } from "../interfaces/url.interface";
import { UrlModel } from "../schemas/url.schema";
import { Capitalization, generateRandomString } from "ts-randomstring/lib";
import { AppException } from "./app.exception";
import { IAppError } from "../interfaces/app_error";
import { bannedDomains, bannedWords } from "../constants/url.constants";

export class Url {
  slug?: String | undefined;
  redirect_url: String | undefined;
  constructor(url?: IUrl) {
    if (url) {
      this.setUrl(url.redirect_url);
      this.slug = url.slug || undefined;
    }
  }
  /**
   * Generates unique slug of n characters long.
   * @param length
   * @returns Promise<String>
   */
  private async generateUniqueSlug(length: number = 5): Promise<String> {
    let slug: String;
    do {
      slug = generateRandomString({
        length: length,
        capitalisation: Capitalization.Lowercase,
      });
      return slug;
      //generate first slug and convert to lowercase since it needs to be case insensitive
    } while ((await UrlModel.find({ slug: slug })).length == 0);
  }

  /**
   * sets url after validating
   * @param redirect_url
   */
  public setUrl(redirect_url: String): void {
    this.redirect_url = this.validateUrl(redirect_url);
  }
  /**
   * Saves url
   * @returns Promise<any>
   */
  async save(): Promise<any> {
    let entity;
    if (this.slug) {
      entity = await this.findBySlug(this.slug);
    } else {
      this.slug = await this.generateUniqueSlug();
      entity = new UrlModel(<IUrl>this);
    }
    return entity.save();
  }
  /**
   * This function validates url structure and checks if domain is banned or url contains banned words
   * @param url
   * @throws AppException
   */
  private validateUrl(url: String) {
    let regex =
      /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
    if (!regex.test(url.toString())) {
      throw new AppException(<IAppError>{
        code: 422,
        message: "Invalid Redirect URL",
      });
    }
    let url_obj = new URL(url.toString());

    bannedWords.forEach((word) => {
      if (url_obj.href.includes(word)) {
        throw new AppException(<IAppError>{
          code: 400,
          message: "URL contains a banned word",
        });
      }
    });

    //check illegal domain

    bannedDomains.forEach((domain) => {
      let domain_parts = url_obj.host.split(".");
      if (domain_parts[domain_parts.length - 2] == domain.split(".")[0]) {
        throw new AppException(<IAppError>{
          code: 451,
          message: "This content is illegal",
        });
      }
    });
    return url;
  }

  async findBySlug(slug: String): Promise<any> {
    return UrlModel.findOne({ slug: slug });
  }
}
