import * as httpMocks from "node-mocks-http";
import { UrlController } from "./url.controller";
import { faker } from "@faker-js/faker";
import { bannedDomains, bannedWords } from "../constants/url.constants";
import { generateRandomString } from "ts-randomstring/lib";

describe("UrlController", () => {
  let controller: UrlController;

  beforeEach(() => {
    controller = new UrlController();
  });

  it("Should create a short URL", async () => {
    const url = faker.internet.url();
    const request = httpMocks.createRequest({
      method: "POST",
      url: "/link",
      body: {
        url: url,
      },
    });
    const response = httpMocks.createResponse();
    console.log(
      "🚀 ~ file: url.controller.spec.ts:40 ~ it ~ response:",
      response
    );

    await controller.createShortUrl(request, response);

    expect(response.statusCode).toBe(201);
    expect(response._getJSONData().result).toBe("success");
    expect(response._getJSONData().message).toMatch(
      new RegExp(`^(URL Created)\\s\/[a-zA-Z0-9]{5}\\s->\\s${url}$`)
    );
  });

  it("Should not create a short URL", async () => {
    bannedWords.forEach(async (word) => {
      const url = faker.internet.url() + "/" + word;

      const request = httpMocks.createRequest({
        method: "POST",
        url: "/link",
        body: {
          url: url,
        },
      });
      const response = httpMocks.createResponse();

      await controller.createShortUrl(request, response);

      expect(response.statusCode).toBe(400);
      expect(response._getJSONData().result).toBe("error");
      expect(response._getJSONData().message).toBe(
        "URL contains a banned word"
      );
    });
  });

  it("Should not create a short URL", async () => {
    let domains = new Set();
    bannedDomains.forEach((domain) => {
      domains.add(domain);
      [".com", ".net", ".io", ".org"].forEach((ext) => {
        domains.add(domain.split(".")[0] + ext);
      });
    });

    domains.forEach(async (domain) => {
      let url = `https://` + domain + "/" + generateRandomString({ length: 5 });

      const request = httpMocks.createRequest({
        method: "POST",
        url: "/link",
        body: {
          url: url,
        },
      });
      const response = httpMocks.createResponse();

      await controller.createShortUrl(request, response);

      expect(response.statusCode).toBe(451);
      expect(response._getJSONData().result).toBe("error");
      expect(response._getJSONData().message).toBe("This content is illegal");
    });
  });
});
