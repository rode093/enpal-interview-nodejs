import { generateRandomString } from "ts-randomstring/lib";
import BaseModel from "./base.model";

/**
 * Url class takes cares of CRUD
 */

class Url extends BaseModel implements IUrl {
  id?: string | undefined;
  slug: string;
  redirect_url: string;

  constructor(redirect_url: string) {
    super();
    if (!this.validateUrl(redirect_url)) {
      throw new Error("Invalid URL or URL not acceptable");
    }
    this.redirect_url = redirect_url;
    this.slug = this.generateSlug();
  }

  private generateSlug(): string {
    let randomstring = generateRandomString({ length: 5 });

    while (this.validateSlug(randomstring) == false) {
      randomstring = generateRandomString({ length: 5 });
    }
  }

  private validateSlug(slug: string): boolean {
    return true;
  }

  private validateUrl(url: string): boolean {
    return true;
  }

  async save() {
    await this.dbClient.prisma.create({
      data: {
        slug: this.slug,
        redirect_url: this.redirect_url,
      },
    });
  }
}

export default Url;
