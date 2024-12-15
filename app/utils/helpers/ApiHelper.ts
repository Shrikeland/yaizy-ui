/* eslint-disable @typescript-eslint/no-explicit-any */
import test, { APIRequestContext, APIResponse, Page } from "@playwright/test";
import { request } from "@playwright/test";
import { AnnotationHelper } from "../annotations/AnnotationHelper";
import { AnnotationType } from "../annotations/AnnotationType";

export class ApiHelper {
  private cookies: { name: string; value: string }[] = [];
  constructor(
    private page: Page,
    private baseURL: string,
    private annotationHelper: AnnotationHelper
  ) {}

  async authorizeAndGetCookies(credentials: {
    type: string;
    identity: string;
    password: string;
  }): Promise<boolean> {
    const loginResponse = await this.page.request.post(
      `${this.baseURL}/api/auth/login`,
      {
        data: credentials,
      }
    );

    const loginResponseHeaders = await loginResponse.headers();
    const authToken = loginResponseHeaders["set-cookie"];

    const cookiesHeader = loginResponse.headers()["set-cookie"];

    const cookiesArray = Array.isArray(cookiesHeader)
      ? cookiesHeader
      : cookiesHeader.split(",");

    const authCookieMatch = cookiesArray.find((cookie: string) =>
      cookie.startsWith("auth=")
    );

    const authCookieValue = authCookieMatch.split(";")[0].split("=")[1];

    const userResponse = await this.page.request.get(
      `${this.baseURL}/api/auth/user`,
      {
        headers: { Cookie: `auth=${authCookieValue}` },
      }
    );

    const setCookieHeader = userResponse.headers()["set-cookie"];
    const cookiesArray2 = Array.isArray(setCookieHeader)
      ? setCookieHeader
      : setCookieHeader.split(",");

    console.log(cookiesArray2);

    const phpSessionIdMatch = cookiesArray2.find((cookie: string) =>
      cookie.startsWith("PHPSESSID=")
    );

    const phpSessionId = phpSessionIdMatch.split(";")[0].split("=")[1];

    this.cookies = [
      { name: "auth", value: authToken },
      { name: "PHPSESSID", value: phpSessionId },
    ];

    return true;
  }

  /**
   * Create a request with cookies
   * @param baseURL base url
   * @returns apiRequest
   */
  async createRequest(baseURL: string): Promise<APIRequestContext> {
    if (this.cookies.length === 0) {
      throw new Error(
        "Cookies отсутствуют, выполните авторизацию перед созданием запроса."
      );
    }
    const apiRequest: APIRequestContext = await request.newContext({
      baseURL: baseURL,
      extraHTTPHeaders: {
        Cookie: this.cookies
          .map((cookie) => `${cookie.name}=${cookie.value}`)
          .join("; "),
      },
    });
    return apiRequest;
  }

  /**
   * Wait for response from url contains the api url
   * @param apiUrl api url to wait until get the response
   * @param statusCode Status code returned by the api
   * @returns responsePromise
   */
  waitForResponse(
    apiUrl: string,
    statusCode = 200,
    method: "POST" | "GET" | "PUT" | "DELETE" = "GET"
  ) {
    const responsePromise = this.page.waitForResponse(
      (response) =>
        response.url().includes(apiUrl) &&
        response.request().method() == method &&
        response.status() == statusCode
    );
    return responsePromise;
  }

  /**
   * Call to api post
   * @param url post url (not base url is needed)
   * @param data data to post
   * @returns
   */
  async get(url: string): Promise<APIResponse> {
    const apiRequest = await this.createRequest(this.baseURL);
    return await apiRequest.get(url);
  }

  /**
   * Call to api post
   * @param url post url (not base url is needed)
   * @param data data to post
   * @returns
   */
  async post(url: string, data: any): Promise<APIResponse> {
    const apiRequest = await this.createRequest(this.baseURL);
    return await apiRequest.post(url, { data: data });
  }

  /**
   * Call to api post
   * @param url post url (not base url is needed)
   * @param data data to post
   * @returns
   */

  async put(url: string, data: any): Promise<APIResponse> {
    const apiRequest = await this.createRequest(this.baseURL);
    return await apiRequest.put(url, { data: data });
  }

  /**
   * Call to api delete
   * @param url delete url (not base url is needed)
   * @returns
   */
  async delete(url: string): Promise<APIResponse> {
    const apiRequest = await this.createRequest(this.baseURL);
    return await apiRequest.delete(url);
  }

  async mockApi(description: string, url: string, jsonData: any) {
    this.annotationHelper.addAnnotation(AnnotationType.Mock, description);
    await test.step(description, async () => {
      await this.page.route(url, async (route) => {
        await route.fulfill({ body: JSON.stringify(jsonData) });
      });
    });
  }
}
