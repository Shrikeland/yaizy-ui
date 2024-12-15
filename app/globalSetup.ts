import { Page, chromium } from "@playwright/test";
import { LoginApi } from "./services/LoginApi";
import { Login } from "./utils/models/Login";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";

const authFolder = "auth";
const baseURL = process.env.BASE_URL ?? "https://admin.test-1.yaizy.io";
dotenv.config();

async function globalSetup() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(baseURL);

  let userLogin: Login = {
    type: process.env.ADMIN_ROLE ?? "",
    identity: process.env.ADMIN_USER ?? "",
    password: process.env.ADMIN_PASSWORD ?? "",
  };
  await setAuthCookies(page, userLogin, "admin.json");

  userLogin = {
    type: process.env.TEACHER_ROLE ?? "",
    identity: process.env.TEACHER_USER ?? "",
    password: process.env.TEACHER_PASSWORD ?? "",
  };
  await setAuthCookies(page, userLogin, "user.json");
  await browser.close();
}

async function setAuthCookies(page: Page, userLogin: Login, fileName: string) {
  const loginApi = new LoginApi(page);
  const loginSuccess = await loginApi.login(userLogin);

  if (!loginSuccess) {
    throw new Error(
      `Не удалось выполнить авторизацию для пользователя ${userLogin.identity}`
    );
  }

  const storageState = await page.context().storageState();
  const updatedCookies = [
    ...storageState.cookies,
    {
      name: "auth.loggedIn",
      value: "true",
      domain: "admin.test-1.yaizy.io",
      path: "/",
      expires: -1,
      httpOnly: false,
      secure: true,
      sameSite: "Lax",
    },
  ];

  const updatedStorageState = {
    ...storageState,
    cookies: updatedCookies,
  };

  const filePath = path.join(authFolder, fileName);
  fs.writeFileSync(filePath, JSON.stringify(updatedStorageState));
}

export default globalSetup;
