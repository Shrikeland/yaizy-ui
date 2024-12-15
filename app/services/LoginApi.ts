import { Page } from "@playwright/test";
import { ApiHelper } from "../utils/helpers/ApiHelper";
import { Login } from "../utils/models/Login";
import { AnnotationHelper } from "../utils/annotations/AnnotationHelper";

export class LoginApi {
  private apiHelper: ApiHelper;
  private annotationHelper: AnnotationHelper;

  constructor(private page: Page) {
    const baseURL = process.env.BASE_URL ?? "https://admin.test-1.yaizy.io";
    this.annotationHelper = new AnnotationHelper(this.page, "login");
    this.apiHelper = new ApiHelper(this.page, baseURL, this.annotationHelper);
  }

  /**
   * Login
   * @param login User to login
   * @returns True if login is successful, otherwise a false
   */
  async login(login: Login): Promise<boolean> {
    try {
      await this.apiHelper.authorizeAndGetCookies({
        type: login.type,
        identity: login.identity,
        password: login.password,
      });

      console.log("Успешная авторизация. Cookies сохранены.");
      return true;
    } catch (error) {
      console.error("Ошибка авторизации:", error);
      return false;
    }
  }
}
