import * as httpMocks from "node-mocks-http";
import { UrlController } from "./url.controller";
import { faker } from "@faker-js/faker";

describe("UrlController", () => {
  let controller: UrlController;

  beforeEach(() => {
    controller = new UrlController();
  });

  // it('Should create a short URL', async () => {
  //   const request = httpMocks.createRequest();
  //   const response = httpMocks.createResponse();

  //   await controller.createShortUrl(request, response);

  //   expect(response._getData()).toBe('I will save the link');
  // });

  // it('Should redirect a short URL to the original URL', async () => {
  //   const request = httpMocks.createRequest();
  //   const response = httpMocks.createResponse();

  //   await controller.redirectToOriginalUrl(request, response);

  //   expect(response._getData()).toBe('I should parse the URL and redirect');
  // });

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
});
