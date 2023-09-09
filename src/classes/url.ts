import { IUrl } from "../interfaces/url.interface";
import { UrlModel } from "../schemas/url.schema";
import { Capitalization, generateRandomString } from "ts-randomstring/lib";

export class Url implements IUrl {
  slug?: String | undefined;
  redirect_url: String;
  constructor(url: IUrl) {
    this.redirect_url = url.redirect_url;
  }
  private async generateUniqueSlug(): Promise<String> {
    let slug: String;
    do {
      slug = generateRandomString({
        length: 5,
        capitalisation: Capitalization.Lowercase,
      });
      return slug;
      //generate first slug and convert to lowercase since it needs to be case insensitive
    } while ((await UrlModel.find({ slug: slug })).length == 0);

    return slug;
  }

  async create(): Promise<any> {
    this.slug = await this.generateUniqueSlug();
    this.redirect_url = await this.redirect_url;
    console.log("🚀 ~ file: url.ts:29 ~ Url ~ create ~ redirect_url:", this);

    let entity = new UrlModel(this);
    return entity.save();
  }
}
