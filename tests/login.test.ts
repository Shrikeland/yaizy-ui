import { test } from "@playwright/test";
import { LoginPage } from "../app/pages/LoginPage";
import { AnnotationType } from "../app/utils/annotations/AnnotationType";

// doesn't share the logged-in session
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Login", () => {
  // eslint-disable-next-line playwright/expect-expect
  test(
    "Login with valid user load inventory page",
    {
      tag: ["@Basic"],
      annotation: [
        {
          type: AnnotationType.Description,
          description: "Login with valid user on Yaizy",
        },
        {
          type: AnnotationType.Precondition,
          description: "A valid username and password",
        },
      ],
    },
    async ({ page }) => {
      // await allure.feature("Basic");
      // await allure.suite("Yaizy");
      const loginPage = new LoginPage(page);
      await loginPage.goTo();
      //For security is better add your user info in environment variables or some Key Value service
      await loginPage.loginWithUser(
        process.env.USER_NAME!,
        process.env.PASSWORD!
      );
      const expectedPage = loginPage.BASE_URL + "/auth/login";
      await loginPage.AssertEqual(
        expectedPage,
        page.url(),
        'Check URL Page is equal to: "' + expectedPage + '"'
      );
    }
  );
});