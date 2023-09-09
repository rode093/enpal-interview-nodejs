import { IUrl } from "../interfaces/url.interface";
import { UrlModel } from "../schemas/url.schema";
import { Capitalization, generateRandomString } from "ts-randomstring/lib";

export class Url implements IUrl {
  slug?: String | undefined;
  redirect_url: String;
  constructor(url: IUrl) {
    this.redirect_url = url.redirect_url;
    this.slug = url.slug || undefined;
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

  async save(): Promise<any> {
    let entity;
    if (this.slug) {
      entity = UrlModel.findOne({ slug: this.slug });
    } else {
      entity = new UrlModel(<IUrl>this);
    }
    return entity.save();
  }
}
